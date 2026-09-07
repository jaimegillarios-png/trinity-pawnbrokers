/**
 * Decides how much of this site Cloudflare should route through a Worker.
 *
 * The Cloudflare adapter always emits a Worker and a _routes.json that names
 * every prerendered page in `exclude`. Two things are wrong with that list:
 * it has to be right about every page (a page it misses gets served by a
 * cold-starting Worker for no reason), and its entries carry no trailing slash
 * while real requests do — so /about/ was missing the exclude for /about and
 * going through the Worker to be handed a file sitting right there. That is
 * where the intermittent 522s came from.
 *
 * Two outcomes, chosen by what the source actually says:
 *
 *   Nothing sets `prerender = false` → no Worker is shipped at all.
 *   Something does → the Worker stays, but _routes.json is rewritten as an
 *   allow-list of only those routes. An allow-list cannot go stale the way the
 *   exclude list could: a page added tomorrow is static by default, which is
 *   the safe direction to be wrong in.
 */
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const pagesDir = resolve(root, 'src/pages');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** src/pages/api/checkout.ts → /api/checkout  ·  src/pages/shop/x.astro → /shop/x */
function routeFor(file) {
  const path = file.replace(pagesDir, '').replace(/\.(astro|ts|js)$/, '');
  const url = path.replace(/\/index$/, '') || '/';
  // A dynamic segment becomes a wildcard: Pages matches on prefix, not params.
  return url.includes('[') ? `${url.slice(0, url.indexOf('['))}*` : url;
}

const ssr = [];
for await (const file of walk(pagesDir)) {
  if (!/\.(astro|ts|js)$/.test(file)) continue;
  const src = await readFile(file, 'utf8');
  if (/export\s+const\s+prerender\s*=\s*false/.test(src)) ssr.push(file);
}

if (!ssr.length) {
  for (const name of ['_worker.js', '_routes.json']) {
    const path = resolve(dist, name);
    try {
      await stat(path);
      await rm(path, { recursive: true, force: true });
      console.log(`  removed dist/${name}`);
    } catch {
      /* already gone */
    }
  }
  console.log('  Static deploy: no route needs the Worker.');
  process.exit(0);
}

const routes = ssr.map(routeFor).sort();
const include = [
  ...routes,
  // Both spellings. Pages matches the path as requested, and a form posting to
  // /api/checkout/ must not fall through to a 404 asset lookup.
  ...routes.filter((r) => !r.endsWith('*')).map((r) => `${r}/`),
  // Astro's own runtime endpoints. Neither is a page, and both 500 if they are
  // served as static assets.
  '/_server-islands/*',
  '/_image',
];

await writeFile(
  resolve(dist, '_routes.json'),
  JSON.stringify({ version: 1, include, exclude: [] }, null, 2) + '\n',
);

console.log(`  Worker kept for ${routes.length} server route(s):`);
for (const route of routes) console.log(`    ${route}`);
console.log('  Everything else is served straight from static assets.');
