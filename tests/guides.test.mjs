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

test('both launch guides are built', () => {
  for (const slug of ['pawnbroking', 'types-of-gold']) page(`guides/${slug}`);
});

test('unconfirmed figures are shown exactly as written', () => {
  const t = text(page('guides/pawnbroking'));
  for (const placeholder of ['[80%]', '[CONFIRM]', '[£25,000]', '[£500]', '[ROLE]', '[DATE]', '[741896]',
    '[COMPLIANCE-APPROVED REPRESENTATIVE EXAMPLE, VERBATIM]']) {
    assert.ok(t.includes(placeholder), `pawnbroking guide has lost ${placeholder}`);
  }
});

test('notes meant for us never reach the page', () => {
  const t = text(page('guides/pawnbroking'));
  for (const note of ['This paragraph does more work', 'Box this', 'Do not soften it', 'callout treatment']) {
    assert.ok(!t.includes(note), `a note is on the page: "${note}"`);
  }
  assert.ok(!text(page('guides/types-of-gold')).includes('The 916.6 is deliberate'));
});

test('the only call to action is the closing band above the footer', () => {
  for (const slug of [...guideSlugs().map((g) => `guides/${g}`), 'guides']) {
    const html = page(slug);
    const footer = html.lastIndexOf('<footer class="tr-footer');
    const band = html.indexOf('class="closing-band"');
    assert.ok(band > 0 && band < footer, `${slug}: no closing band above the footer`);
    const beforeBand = html.slice(html.indexOf('</header>'), band);
    assert.equal((beforeBand.match(/class="tr-cta/g) || []).length, 0, `${slug}: a button above the closing band`);
    assert.equal((html.slice(band, footer).match(/class="tr-cta/g) || []).length, 1, `${slug}: band has no button`);
  }
});

test('the gold guide sends people to the gold valuation form', () => {
  const html = page('guides/types-of-gold');
  const band = html.slice(html.indexOf('class="closing-band"'));
  assert.match(band, /href="\/gold#value-form"/);
});

test('quick answers are in the page on load and match the FAQPage schema', () => {
  for (const slug of guideSlugs()) {
    const html = page(`guides/${slug}`);
    const faq = structuredData(html).find((d) => d['@type'] === 'FAQPage');
    assert.ok(faq, `${slug}: no FAQPage`);
    // Stripping a link's tags leaves a space before the next full stop.
    // Entities are decoded so an apostrophe compares as an apostrophe.
    const norm = (s) => s
      .replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      .replace(/\s+([.,;:?])/g, '$1');
    const t = norm(text(html));
    for (const q of faq.mainEntity) {
      assert.ok(t.includes(norm(q.name)), `${slug}: question not on the page: ${q.name}`);
      assert.ok(t.includes(norm(q.acceptedAnswer.text)), `${slug}: answer differs from the page: ${q.name}`);
    }
  }
});

test('every h2 and h3 in a guide has an anchor', () => {
  for (const slug of guideSlugs()) {
    const html = page(`guides/${slug}`);
    const prose = html.slice(html.indexOf('guide-prose'), html.indexOf('guide-end'));
    const bare = prose.match(/<h[23](?![^>]*\bid=)[^>]*>/g) || [];
    assert.deepEqual(bare, [], `${slug}: headings without an id`);
  }
});
