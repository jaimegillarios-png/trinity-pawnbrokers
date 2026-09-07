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
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createDecipheriv } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'scripts/data/unbolted/videos');
const SITE = 'https://unboltedluxury.com';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const get = (url, as = 'text', range = null) =>
  fetch(url, {
    headers: {
      'user-agent': UA,
      referer: SITE + '/',
      ...(range ? { range: `bytes=${range.start}-${range.end}` } : {}),
    },
  }).then((r) => {
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
 * The largest rendition, because we transcode it ourselves afterwards.
 *
 * Taking the small one and shipping it as-is was the earlier approach and it
 * was the wrong trade: the source's own 360p is encoded at up to 17Mbps, so it
 * was both heavy and soft. Downscaling 1080p to 720p at a sane bitrate is
 * smaller and sharper than either.
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
  return options.sort((a, b) => b.pixels - a.pixels)[0]?.url;
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
 * MPEG-TS is not playable in a browser, and the source encoding is far too
 * heavy to serve — up to 17Mbps for 360p. ffmpeg does both jobs at once:
 * downscale to 720p, re-encode at a sane quality, and move the moov atom to
 * the front so playback can start before the file has finished arriving.
 *
 * The long side is capped rather than the height, because one of these was
 * filmed upright and would otherwise be scaled to 720 wide and 1280 tall.
 */
function transcode(tsPath, mp4Path) {
  const args = [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', tsPath,
    '-vf', "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))':flags=lanczos",
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart',
    mp4Path,
  ];
  return new Promise((done, fail) => {
    const proc = spawn(ffmpeg, args);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (code) => (code === 0 ? done() : fail(new Error(stderr.slice(0, 300)))));
  });
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

  /**
   * These playlists use #EXT-X-BYTERANGE: every "segment" line points at the
   * same file and names a slice of it. Treating them as separate URLs
   * downloaded the whole thing once per segment — eleven copies concatenated,
   * which is why a 62-second clip transcoded to eleven minutes.
   *
   * The ranges are contiguous, so the parts reassemble into exactly the
   * original file, which is then decrypted in one pass with the IV the
   * playlist gives.
   */
  const lines = media.split('\n');
  const parts = [];
  let pendingRange = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('#EXT-X-BYTERANGE:')) {
      const [length, offset] = line.slice(17).split('@').map(Number);
      pendingRange = { start: offset || 0, end: (offset || 0) + length - 1 };
      continue;
    }
    if (!line || line.startsWith('#')) continue;
    const url = line.startsWith('http') ? line : base + line + query;
    parts.push({ url, range: pendingRange });
    pendingRange = null;
  }

  const buffers = [];
  for (const part of parts) {
    buffers.push(Buffer.from(await get(part.url, 'buffer', part.range)));
    process.stdout.write('.');
  }

  const joined = Buffer.concat(buffers);
  const chunks = [key ? decrypt(joined, key, 0, iv) : joined];

  const tsPath = resolve(out, `${slug}.ts`);
  await writeFile(tsPath, Buffer.concat(chunks));
  await transcode(tsPath, target);
  await rm(tsPath, { force: true });

  const { size } = await import('node:fs').then((fs) => fs.promises.stat(target));
  return { slug, bytes: size, segments: parts.length, seconds: Math.round(config.durationSeconds) };
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
