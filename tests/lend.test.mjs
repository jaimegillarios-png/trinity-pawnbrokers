import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, home, text, count, structuredData, ASSET_SLUGS } from './helpers.mjs';

const lend = () => page('what-we-lend-against');

test('the hub lists every item page, and links to each', () => {
  const html = lend();
  assert.equal(count(html, /class="lend-item"/g), 7, 'expected all seven categories');
  for (const slug of ASSET_SLUGS) {
    assert.ok(html.includes(`href="/${slug}"`), `no link to /${slug}`);
  }
});

test('it carries what the homepage grid cannot', () => {
  // The reason the page earns a click: the sub-categories each item page
  // accepts. Without these it is the homepage grid with a heading on top.
  const html = lend();
  assert.ok(count(html, /class="lend-item__accepts"/g) >= 6, 'the accepted lists are missing');
  // Ampersands are escaped in the source and text() does not decode entities,
  // so these are all phrases without one.
  for (const phrase of ['Bars and bullion', 'Vintage and rare', 'Old Masters', 'Canteens']) {
    assert.ok(text(html).includes(phrase), `the hub has lost "${phrase}"`);
  }
});

test('the four tests are stated', () => {
  const html = lend();
  assert.equal(count(html, /class="tr-card"/g), 4, 'expected four criteria');
  const t = text(html);
  for (const idea of ['authenticated', 'insured', 'resale market']) {
    assert.ok(t.includes(idea), `the criteria no longer mention ${idea}`);
  }
});

test('the seven are published as an ordered ItemList', () => {
  const cp = structuredData(lend()).find((b) => b['@type'] === 'CollectionPage');
  assert.ok(cp, 'no CollectionPage block');
  const list = cp.mainEntity;
  assert.equal(list['@type'], 'ItemList');
  assert.equal(list.itemListElement.length, 7);
  assert.deepEqual(
    list.itemListElement.map((e) => e.position),
    [1, 2, 3, 4, 5, 6, 7],
    'the list positions are not sequential',
  );
});

test('the main nav points at the page, not at a fragment', () => {
  // The whole reason for building it: "What we lend against" was /#index on
  // every page, which loaded the homepage and jumped past its hero.
  for (const slug of ['index', 'faq', 'about', 'watches']) {
    const html = slug === 'index' ? home() : page(slug);
    const head = html.slice(0, html.indexOf('</header>'));
    assert.ok(
      head.includes('href="/what-we-lend-against"'),
      `${slug}: the nav still points somewhere else`,
    );
    assert.ok(!head.includes('href="/#index"'), `${slug}: the nav fragment link is still there`);
  }
});

test('every internal link on the hub resolves', () => {
  for (const [, href] of lend().matchAll(/href="(\/[^"#]*)/g)) {
    const target = href.includes('.')
      ? resolve(dist, href.replace(/^\//, ''))
      : resolve(dist, href.replace(/^\//, ''), 'index.html');
    assert.ok(existsSync(target), `the hub links to ${href}, which is not in the build`);
  }
});

test('the header is a heading and a standfirst, nothing else', () => {
  const html = lend();
  // Anchored on the markup, not the class name — the inline critical CSS
  // mentions both of these classes before the elements appear.
  const from = html.indexOf('<header class="lend-head">');
  const head = html.slice(from, html.indexOf('<ul class="lend-items"', from));
  assert.equal(count(head, /<h1[\s>]/g), 1, 'expected exactly one heading');
  assert.equal(count(head, /<h2[\s>]/g), 0, 'the header has a second heading again');
  assert.equal(count(head, /<a /g), 0, 'the header should carry no links');
  assert.equal(count(head, /<img/g), 0, 'the header should carry no images');
});
