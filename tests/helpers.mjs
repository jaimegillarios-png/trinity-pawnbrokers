import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dist = resolve(root, 'dist');

/** Every item page. Kept explicit so a page silently disappearing is a failure. */
export const ASSET_SLUGS = [
  'gold', 'watches', 'jewellery', 'diamonds', 'fine-art', 'handbags', 'silver',
];

export function home() {
  return readFileSync(resolve(dist, 'index.html'), 'utf8');
}

export function page(slug) {
  const path = resolve(dist, slug, 'index.html');
  if (!existsSync(path)) throw new Error(`Not built: ${slug}. Run npm run build first.`);
  return readFileSync(path, 'utf8');
}

export function file(relative) {
  return readFileSync(resolve(dist, relative), 'utf8');
}

/** All JSON-LD blocks on a page, parsed. */
export function structuredData(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1]));
}

/** Visible text, with scripts, styles and tags stripped. */
export function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function count(html, pattern) {
  return (html.match(pattern) || []).length;
}
