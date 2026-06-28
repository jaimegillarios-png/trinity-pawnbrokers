// One-off image optimizer for the Trinity Pawnbrokers site.
// Produces right-sized AVIF + WebP + compressed JPEG fallback for each source.
// Run: node scripts/optimize-images.mjs   (requires `sharp`)
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('/tmp/sharp-test/node_modules/sharp/dist/index.cjs');
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'images';
const OUT = 'images/opt';

// Max rendered width (CSS px) per image × ~2 for retina = target intrinsic width.
// Cards/hero never display wider than ~640 CSS px in the 1320 layout.
const MAX_W = {
  'watch-hero': 1280,   // hero, ~620px slot
  'watch-alt': 880,     // offer / case card
  'art-paint': 880,
  'art-abstract': 880,
  'gold-bars': 880,
  'gold-coins': 880,
  'jewellery': 1100,    // why-panel image, wider slot
};
const DEFAULT_MAX = 880;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter(f => /\.jpg$/i.test(f));

for (const file of files) {
  const base = path.basename(file, '.jpg');
  const maxW = MAX_W[base] ?? DEFAULT_MAX;
  const input = path.join(SRC, file);
  const pipeline = sharp(input).resize({ width: maxW, withoutEnlargement: true });

  await pipeline.clone().avif({ quality: 50 }).toFile(path.join(OUT, `${base}.avif`));
  await pipeline.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${base}.webp`));
  await pipeline.clone().jpeg({ quality: 74, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${base}.jpg`));
  console.log(`optimized ${base} (≤${maxW}px)`);
}
console.log('done');
