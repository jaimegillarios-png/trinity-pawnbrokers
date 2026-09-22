import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dist = resolve(root, 'dist');

/** Every item page. Kept explicit so a page silently disappearing is a failure. */
export const ASSET_SLUGS = [
  'gold', 'watches', 'jewellery', 'diamonds', 'fine-art', 'handbags', 'silver',
  'classic-cars', 'wine', 'musical-instruments',
];

/** The seven that were migrated from the hand-built site, and have a source
 *  content file in legacy/src/content as the record of what was moved. The
 *  three added later were written straight into Sanity. */
export const MIGRATED_SLUGS = ASSET_SLUGS.slice(0, 7);

/** Item pages written after the migration, as first drafts awaiting review. */
export const DRAFT_SLUGS = ['classic-cars', 'wine', 'musical-instruments'];

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
