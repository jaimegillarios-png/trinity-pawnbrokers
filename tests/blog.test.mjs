import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, file, structuredData, count } from './helpers.mjs';

const index = () => file('blog/index.html');
const articles = () =>
  readdirSync(resolve(dist, 'blog'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => file(`blog/${e.name}/index.html`));

test('the blog index is built', () => {
  assert.ok(existsSync(resolve(dist, 'blog', 'index.html')));
});

test('the index lists every published article, each with a link, date and excerpt', () => {
  const html = index();
  const cards = count(html, /class="blog-card"/g);
  assert.ok(cards >= 1, 'no articles listed');
  assert.equal(count(html, /class="blog-card__date"/g), cards, 'an article is missing its date');
  assert.equal(count(html, /class="blog-card__excerpt"/g), cards, 'an article is missing its excerpt');
  assert.equal(count(html, /class="blog-card__title"/g), cards, 'an article is missing its title');
});

test('exactly one article is featured, and it is not repeated in the grid', () => {
  const html = index();
  assert.equal(count(html, /class="blog-featured__title"/g), 1, 'there should be one featured article');

  // The feature and the grid must not both link to the same piece.
  const featuredHref = html.match(/class="blog-featured__inner">\s*<a href="([^"]+)"/)?.[1];
  assert.ok(featuredHref, 'the featured article is not linked');
  const gridSection = html.split('class="blog-list"')[1] ?? '';
  assert.ok(!gridSection.includes(`href="${featuredHref}"`),
    'the featured article also appears in the grid');
});

test('the grid holds every article except the featured one', () => {
  const html = index();
  const total = readdirSync(resolve(dist, 'blog'), { withFileTypes: true })
    .filter((e) => e.isDirectory()).length;
  assert.equal(count(html, /class="blog-card"/g), total - 1,
    'the grid should hold every article but the featured one');
});

test('every article carries a cover image with alt text', () => {
  for (const html of articles()) {
    const cover = html.match(/<img class="article__cover"[^>]*alt="([^"]*)"/);
    assert.ok(cover, 'no cover image');
    assert.ok(cover[1].length > 0, 'cover image has empty alt text');
  }
});

test('every article carries Article structured data, dated and attributed', () => {
  for (const html of articles()) {
    const blocks = structuredData(html);
    const article = blocks.find((b) => b['@type'] === 'Article');
    assert.ok(article, 'no Article schema');
    assert.ok(article.headline, 'no headline');
    assert.ok(article.datePublished, 'no publication date');
    // Author and publisher reference the organisation the layout emits, rather
    // than describing the business twice.
    assert.match(article.author['@id'], /#organisation$/, 'author is not the organisation');
    assert.match(article.publisher['@id'], /#organisation$/, 'publisher is not the organisation');

    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    assert.equal(crumbs.itemListElement.length, 3, 'breadcrumb should be Home > Blog > article');
  }
});

test('article body copy is styled, not raw', () => {
  // The legal pages rendered Portable Text with no stylesheet at all for a
  // while; the class alone is not proof, so check the stylesheet is loaded.
  for (const html of articles()) {
    assert.match(html, /class="tr-prose"/, 'no prose container');
    assert.ok(/<link rel="stylesheet"[^>]+_astro\/[^"]+\.css/.test(html), 'no bundled stylesheet');
  }
});

test('the blog is reachable from the footer', () => {
  assert.match(index(), /class="tr-footer__nav"[\s\S]*?href="\/blog"/, 'no footer link to the blog');
});

test('placeholder articles are kept out of search', () => {
  // The seeded article exists to review the layout. If it is still present it
  // must not be indexable.
  for (const html of articles()) {
    if (/Placeholder article/.test(html)) {
      assert.match(html, /<meta name="robots" content="noindex/, 'a placeholder article is indexable');
    }
  }
});
