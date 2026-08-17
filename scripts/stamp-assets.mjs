#!/usr/bin/env node
/**
 * Cache-busts local CSS/JS by stamping a content hash onto every reference.
 *
 *   src/styles/trinity-components.css  ->  ...css?v=9f3a1c22
 *
 * Why this exists: GitHub Pages caches HTML and CSS independently for ~10
 * minutes, so a deploy can leave a browser holding NEW markup and OLD styles.
 * Anything where the markup depends on new CSS then renders broken. Hashing the
 * URL means new markup can only ever load the stylesheet it was built against.
 *
 * Run after building:  node scripts/build-asset-pages.mjs && node scripts/stamp-assets.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---- hash every local asset ------------------------------------------------
const versions = new Map();
for (const dir of ['src/styles', 'src/scripts']) {
  for (const file of await readdir(resolve(root, dir))) {
    if (!/\.(css|js)$/.test(file)) continue;
    const rel = `${dir}/${file}`;
    const hash = createHash('sha1').update(await readFile(resolve(root, rel))).digest('hex').slice(0, 8);
    versions.set(rel, hash);
  }
}

// ---- stamp every reference in every page -----------------------------------
const pages = (await readdir(root)).filter((f) => f.endsWith('.html'));
const REF = /(src\/(?:styles|scripts)\/[\w.-]+\.(?:css|js))(\?v=[a-f0-9]+)?/g;

let touched = 0;
for (const page of pages) {
  const path = join(root, page);
  const before = await readFile(path, 'utf8');
  const after = before.replace(REF, (m, file) => {
    const v = versions.get(file);
    return v ? `${file}?v=${v}` : m;
  });
  if (after !== before) { await writeFile(path, after, 'utf8'); touched++; }
}

console.log([...versions].map(([f, v]) => `  ${v}  ${f}`).join('\n'));
console.log(`\n${touched} page${touched === 1 ? '' : 's'} stamped, ${pages.length} checked.`);
