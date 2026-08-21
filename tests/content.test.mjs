import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { page, home, ASSET_SLUGS, root, count } from './helpers.mjs';

/**
 * The migration is one-way, so the source content files stay the record of
 * what should be on each page. These compare the built pages back against
 * them — the check that caught chips being eaten and a section going missing.
 */
const CONTENT = resolve(root, 'legacy/src/content');

async function source(slug) {
  const mod = await import(pathToFileURL(resolve(CONTENT, `${slug}.js`)).href);
  return mod.default;
}

test('the source content files still exist as the migration record', () => {
  const files = readdirSync(CONTENT).filter((f) => f.endsWith('.js'));
  assert.equal(files.length, ASSET_SLUGS.length);
});

for (const slug of ASSET_SLUGS) {
  test(`${slug}: every compliance marker survives`, async () => {
    const c = await source(slug);
    const html = page(slug);

    // Count the markers in the source, wherever they were written — as chip
    // fields, or inline inside a title, answer or label.
    const json = JSON.stringify(c);
    const inline = (json.match(/confirm-chip/g) || []).length;
    const fields = (json.match(/"chip":"[^"]+"/g) || []).length
                 + (json.match(/"trinityChip":"[^"]+"/g) || []).length;
    const expected = inline + fields;

    const rendered = count(html, /class="confirm-chip"/g);
    assert.equal(rendered, expected,
      `${slug}: ${expected} markers in the content, ${rendered} on the page`);
  });

  test(`${slug}: every FAQ and comparison row is rendered`, async () => {
    const c = await source(slug);
    const html = page(slug);
    assert.equal(count(html, /class="faq-item"/g), c.faqs.items.length, 'FAQ count');
    assert.equal(count(html, /class="cmp-row"/g), c.why.rows.length, 'comparison rows');
    assert.equal(count(html, /class="how-step"/g), c.how.steps.length, 'how-it-works steps');
  });

  test(`${slug}: the hero headline and intro are the ones written`, async () => {
    const c = await source(slug);
    const html = page(slug);
    const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const heading = strip(c.hero.heading);
    const rendered = html.match(/<h1 id="hero-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    assert.equal(strip(rendered), heading, 'hero headline');
    assert.ok(html.includes(strip(c.hero.intro).slice(0, 60)), 'hero intro');
  });
}

test('no HTML entities leak through the CMS as literal text', () => {
  // The content files were written to be interpolated into HTML, so they carry
  // `&amp;`, `&ndash;` and friends. Sanity stores text — an entity that reaches
  // a document is escaped again on render and the page shows "&amp;" to the
  // reader, and the Studio shows it to the client.
  const leaks = [];
  for (const slug of ['index', ...ASSET_SLUGS, 'blog']) {
    const html = slug === 'index' ? home() : page(slug);
    for (const m of html.matchAll(/&amp;[a-zA-Z#][a-zA-Z#0-9]{1,7};/g)) {
      leaks.push(`${slug}: ${m[0]} — ${html.slice(Math.max(0, m.index - 40), m.index + 20).replace(/\s+/g, ' ')}`);
    }
  }
  assert.deepEqual(
    leaks.slice(0, 8), [],
    `${leaks.length} entities are stored as text instead of characters. Re-run the migration.`,
  );
});
