/**
 * Every route in this project is prerendered — nothing sets
 * `export const prerender = false`. The Cloudflare adapter emits a Worker and
 * a _routes.json anyway, and Pages then runs that Worker for any path the
 * exclude list misses. Its exclude entries have no trailing slash while the
 * requests do, so most pages were going through a cold-starting Worker to be
 * handed a file that was sitting right there — which is where the intermittent
 * 522s came from.
 *
 * So: if nothing needs the Worker, do not ship one. If a route ever opts into
 * SSR this refuses to run, rather than silently breaking it.
 */
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const pages = resolve(root, 'src/pages');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const ssr = [];
for await (const file of walk(pages)) {
  if (!/\.(astro|ts|js)$/.test(file)) continue;
  const src = await readFile(file, 'utf8');
  if (/export\s+const\s+prerender\s*=\s*false/.test(src)) ssr.push(file.replace(root + '/', ''));
}

if (ssr.length) {
  console.log(`  Worker kept — these routes render on the server:\n    ${ssr.join('\n    ')}`);
  process.exit(0);
}

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
