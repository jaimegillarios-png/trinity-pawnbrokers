/**
 * Pulls the real catalogue off unboltedluxury.com.
 *
 * Unbolted and Trinity are the same firm — Open Access Finance Ltd — so this
 * is the client's own stock, photography and copy, not someone else's. The
 * site runs on Squarespace, which will hand over a page as JSON if asked, so
 * nothing here scrapes markup: prices arrive already in pence, stock as a
 * count, and the specification as the label/value pairs it was written as.
 *
 * Writes a manifest and the images to scripts/data/unbolted/. Re-runnable:
 * an image already on disk is not fetched again.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'scripts/data/unbolted');
const imagesDir = resolve(out, 'images');
const SITE = 'https://unboltedluxury.com';

const json = async (path) => {
  const res = await fetch(`${SITE}${path}${path.includes('?') ? '&' : '?'}format=json`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
};

/**
 * The specification is written as bold label / plain value pairs, but not
 * consistently marked up: some products put each row in its own <p>, others
 * run them together separated by <br><br>. So rather than trusting either
 * structure, this splits on the <strong> tags themselves — a label is
 * whatever is bold, its value is everything up to the next bold thing.
 */
function specs(html = '') {
  const clean = (s) =>
    /* <br> is a real break; every other tag is invisible and must collapse to
       nothing, or a <span> opened mid-word turns "sapphire" into "sapp hire". */
    s.replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li)>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&rsquo;/g, '\u2019')
      .replace(/&quot;/g, '"')
      .replace(/&times;/g, '\u00d7')
      .replace(/&pound;/g, '\u00a3')
      .replace(/&euro;/g, '\u20ac')
      .replace(/&dollar;/g, '$')
      .replace(/&mdash;/g, '\u2014')
      .replace(/&ndash;/g, '\u2013')
      .replace(/&deg;/g, '\u00b0')
      /* Numeric entities carry the £ on some of these too, and a catch-all
         that dropped them turned "RRP £12,600" into "RRP 12,600". */
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&[a-z]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const rows = [];
  const parts = [...html.matchAll(/<strong>([\s\S]*?)<\/strong>([\s\S]*?)(?=<strong>|$)/g)];
  for (const [, rawLabel, rawValue] of parts) {
    const label = clean(rawLabel).replace(/[:\s]+$/, '');
    const value = clean(rawValue).replace(/^[:\s]+/, '');
    if (label && value) rows.push({ label, value });
  }
  return rows;
}

await mkdir(imagesDir, { recursive: true });

const list = await json('/shop');
const stubs = list.items ?? [];
console.log(`  ${stubs.length} products listed\n`);

const products = [];
for (const stub of stubs) {
  const { item } = await json(`/shop/p/${stub.urlId}`);
  const variant = item.variants?.[0] ?? {};
  const rows = specs(item.excerpt);

  /* Sold stock is listed at £0.00 with the word SOLD in the title. Price comes
     from the variant, which keeps its real figure even once sold — worth
     having, because a sold piece with a price reads as a record rather than a
     gap. */
  const stock = variant.unlimited ? 99 : (variant.qtyInStock ?? 0);
  const soldByName = /\bsold\b/i.test(item.title);

  const images = [];
  for (const [i, media] of (item.items ?? []).entries()) {
    if (!media.assetUrl) continue;
    const ext = (media.assetUrl.match(/\.(jpe?g|png|webp)/i)?.[1] ?? 'jpg').toLowerCase();
    const name = `${stub.urlId}-${String(i + 1).padStart(2, '0')}.${ext}`;
    const path = resolve(imagesDir, name);
    if (!existsSync(path)) {
      const res = await fetch(`${media.assetUrl}?format=2500w`);
      if (res.ok) {
        await writeFile(path, Buffer.from(await res.arrayBuffer()));
        process.stdout.write('.');
      } else {
        process.stdout.write('x');
        continue;
      }
    }
    images.push({ file: name, alt: `${item.title} — image ${i + 1}` });
  }

  products.push({
    slug: stub.urlId,
    title: item.title.replace(/\s*-\s*SOLD\s*$/i, '').trim(),
    price: variant.price ?? item.priceCents ?? 0,
    stock,
    sold: soldByName || stock < 1,
    specs: rows,
    images,
    source: `${SITE}/shop/p/${stub.urlId}`,
  });
  console.log(` ${item.title} — ${images.length} images, ${rows.length} spec rows`);
}

await writeFile(resolve(out, 'products.json'), JSON.stringify(products, null, 2));
const files = await readdir(imagesDir);
console.log(`\n  ${products.length} products → scripts/data/unbolted/products.json`);
console.log(`  ${files.length} images → scripts/data/unbolted/images/`);
