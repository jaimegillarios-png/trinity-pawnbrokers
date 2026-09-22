import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, text, structuredData } from './helpers.mjs';

const guideSlugs = () => {
  const dir = resolve(dist, 'guides');
  return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
};

test('the guides hub is built, with one h1 and a CollectionPage', () => {
  const html = page('guides');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.ok(structuredData(html).some((d) => d['@type'] === 'CollectionPage'));
});

test('the hub links every guide that was built, and nothing that was not', () => {
  const html = page('guides');
  const linked = [...html.matchAll(/href="\/guides\/([^"/]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(linked)].sort(), guideSlugs().sort());
});

test('each guide has one h1, an Article, and anchored contents that resolve', () => {
  for (const slug of guideSlugs()) {
    const html = page(`guides/${slug}`);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${slug}: h1 count`);
    assert.ok(structuredData(html).some((d) => d['@type'] === 'Article'), `${slug}: no Article`);
    for (const [, id] of html.matchAll(/data-guide-contents[\s\S]*?<\/details>/g).next().value?.[0].matchAll(/href="#([^"]+)"/g) ?? []) {
      assert.ok(html.includes(`id="${id}"`), `${slug}: contents link #${id} has no target`);
    }
  }
});

test('bracketed placeholders reach the page untouched', () => {
  // Unconfirmed figures are written as [X,XXX] and must be shown as written,
  // never swallowed as markdown link syntax.
  for (const slug of guideSlugs()) {
    const body = text(page(`guides/${slug}`));
    assert.ok(!/\]\(/.test(body), `${slug}: raw markdown link syntax on the page`);
  }
});
