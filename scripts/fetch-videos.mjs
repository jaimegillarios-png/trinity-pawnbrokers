/**
 * Brings the product films across from the old site.
 *
 * Unbolted film every piece running, and the product copy points at that film
 * ("please review the photos plus a video of this actual watch"), so the pages
 * are incomplete without them.
 *
 * They are served as HLS: a playlist of MPEG-TS segments, AES-128 encrypted,
 * behind signed URLs that expire within the hour. Nothing here circumvents
 * access control — the key is handed to any player that asks, which is how
 * HLS works — but it does mean the file has to be reassembled rather than
 * downloaded: fetch the playlist, fetch the key, decrypt each segment, then
 * remux the MPEG-TS into MP4 so a browser can play it.
 *
 * The signatures expiring is why this fetches the playlist fresh each run
 * rather than caching URLs.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createDecipheriv } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import muxjs from 'mux.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'scripts/data/unbolted/videos');
const SITE = 'https://unboltedluxury.com';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const get = (url, as = 'text') =>
  fetch(url, { headers: { 'user-agent': UA, referer: SITE + '/' } }).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 90)}`);
    return as === 'text' ? r.text() : r.arrayBuffer();
  });

/** The player config is in the page markup, not the JSON API. */
async function videoConfig(slug) {
  const html = await get(`${SITE}/shop/p/${slug}`);
  const m = html.match(/data-config-video="([^"]+)"/);
  if (!m) return null;
  return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
}

/**
 * The lightest rendition, not the largest.
 *
 * The source serves adaptive HLS and can afford a 32Mbps 1080p ladder; we
 * serve one file to everybody, and a 249MB clip beside a photograph is not a
 * product video, it is a download. The small rendition is 640x360-ish and
 * around a tenth the weight, which is the right trade for a clip that plays
 * in a 600px frame. Re-run with VIDEO_QUALITY=high to take the big one.
 */
function bestVariant(master) {
  const lines = master.split('\n');
  const options = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#EXT-X-STREAM-INF')) continue;
    const res = lines[i].match(/RESOLUTION=(\d+)x(\d+)/);
    const url = lines[i + 1]?.trim();
    if (url) options.push({ url, pixels: res ? Number(res[1]) * Number(res[2]) : 0 });
  }
  const ordered = options.sort((a, b) => a.pixels - b.pixels);
  return (process.env.VIDEO_QUALITY === 'high' ? ordered[ordered.length - 1] : ordered[0])?.url;
}

/**
 * AES-128 as HLS specifies it: CBC, and where the playlist gives no explicit
 * IV the media sequence number is used, big-endian in the low 8 bytes.
 */
function decrypt(buffer, key, sequence, iv) {
  const nonce = iv ?? Buffer.alloc(16);
  if (!iv) nonce.writeUInt32BE(sequence, 12);
  const decipher = createDecipheriv('aes-128-cbc', key, nonce);
  decipher.setAutoPadding(false);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
}

/**
 * MPEG-TS is not playable in a browser; fragmented MP4 is.
 *
 * Each segment is transmuxed on its own, the way a player does it. Pushing the
 * whole concatenated stream in one go looks tidier and is wrong: the PTS
 * resets at every segment boundary read as enormous gaps, and a fourteen
 * second clip came out claiming twenty-six hours — and carrying the padding to
 * match, which is where the weight was coming from.
 */
async function remux(segments) {
  let init = null;
  const parts = [];

  for (const segment of segments) {
    await new Promise((done, fail) => {
      const transmuxer = new muxjs.mp4.Transmuxer({ remux: true, keepOriginalTimestamps: false });
      transmuxer.on('data', (out) => {
        if (!init) init = Buffer.from(out.initSegment);
        parts.push(Buffer.from(out.data));
      });
      transmuxer.on('done', done);
      transmuxer.on('error', fail);
      transmuxer.push(new Uint8Array(segment));
      transmuxer.flush();
    });
  }

  if (!init || !parts.length) throw new Error('transmuxer produced nothing');
  return Buffer.concat([init, ...parts]);
}

async function fetchOne(slug) {
  const target = resolve(out, `${slug}.mp4`);
  if (existsSync(target)) return { slug, skipped: true };

  const config = await videoConfig(slug);
  if (!config) return { slug, none: true };

  const master = await get(config.alexandriaUrl.replace('{variant}', 'playlist.m3u8'));
  const variantUrl = bestVariant(master);
  if (!variantUrl) throw new Error('no rendition in master playlist');

  const media = await get(variantUrl);
  const base = variantUrl.slice(0, variantUrl.lastIndexOf('/') + 1);
  const query = variantUrl.includes('?') ? variantUrl.slice(variantUrl.indexOf('?')) : '';

  const keyLine = media.match(/#EXT-X-KEY:([^\n]+)/);
  let key = null;
  let iv = null;
  if (keyLine && !/METHOD=NONE/.test(keyLine[1])) {
    const uri = keyLine[1].match(/URI="([^"]+)"/)?.[1];
    key = Buffer.from(await get(uri, 'buffer'));
    const rawIv = keyLine[1].match(/IV=0x([0-9a-f]+)/i)?.[1];
    if (rawIv) iv = Buffer.from(rawIv, 'hex');
  }

  const segments = media
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => (line.startsWith('http') ? line.trim() : base + line.trim() + query));

  const chunks = [];
  for (const [i, url] of segments.entries()) {
    const raw = Buffer.from(await get(url, 'buffer'));
    chunks.push(key ? decrypt(raw, key, i, iv) : raw);
    process.stdout.write('.');
  }

  const mp4 = await remux(chunks);
  await writeFile(target, mp4);
  return { slug, bytes: mp4.length, segments: segments.length, seconds: Math.round(config.durationSeconds) };
}

await mkdir(out, { recursive: true });
const products = JSON.parse(
  await readFile(resolve(root, 'scripts/data/unbolted/products.json'), 'utf8'),
);

for (const product of products) {
  try {
    const result = await fetchOne(product.slug);
    if (result.skipped) console.log(` ${product.slug} — already have it`);
    else if (result.none) console.log(` ${product.slug} — no video on the source page`);
    else console.log(` ${product.slug} — ${(result.bytes / 1e6).toFixed(1)}MB, ${result.seconds}s`);
  } catch (error) {
    console.log(` ${product.slug} — FAILED: ${error.message}`);
  }
}
