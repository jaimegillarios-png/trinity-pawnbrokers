import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, file, ASSET_SLUGS, count } from './helpers.mjs';

test('every item page is built', () => {
  for (const slug of ASSET_SLUGS) {
    assert.ok(existsSync(resolve(dist, slug, 'index.html')), `${slug} is missing from the build`);
  }
});

test('the crawl files are generated', () => {
  assert.ok(existsSync(resolve(dist, 'robots.txt')), 'robots.txt is missing');
  assert.ok(existsSync(resolve(dist, 'sitemap-index.xml')), 'sitemap-index.xml is missing');
  assert.match(file('robots.txt'), /Sitemap: https?:\/\/\S+\/sitemap-index\.xml/);
});

test('a 404 page exists', () => {
  assert.ok(existsSync(resolve(dist, '404.html')));
});

/**
 * This is the check that would have caught the worst bug of the rebuild: the
 * stylesheet that was never imported, which left every item page as unstyled
 * text while the type checker stayed perfectly happy.
 */
test('each page loads its stylesheets and icon fonts', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    assert.ok(/<link rel="stylesheet"[^>]+_astro\/[^"]+\.css/.test(html),
      `${slug}: no bundled stylesheet`);
    assert.ok(html.includes('phosphor-icons'), `${slug}: icon font not loaded`);
    assert.ok(html.includes('fonts.googleapis.com'), `${slug}: web fonts not loaded`);
  }
});

test('pages carry rendered content, not just chrome', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    assert.ok(count(html, /class="tr-card"/g) >= 4, `${slug}: too few cards`);
    assert.ok(count(html, /class="faq-item"/g) >= 5, `${slug}: too few FAQs`);
  }
});
