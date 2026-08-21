import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, home, text, ASSET_SLUGS } from './helpers.mjs';

const footer = (html) => html.slice(html.lastIndexOf('<footer'));

const links = (html) =>
  [...footer(html).matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]);

/** Internal routes only — mailto:/tel: are checked separately. */
const internal = (hrefs) => hrefs.filter((h) => h.startsWith('/'));

test('every footer link resolves to a page that was actually built', () => {
  const hrefs = internal(links(home()));
  assert.ok(hrefs.length >= 12, `expected a structured footer, got ${hrefs.length} links`);

  for (const href of hrefs) {
    const target = href === '/'
      ? resolve(dist, 'index.html')
      : resolve(dist, href.replace(/^\//, ''), 'index.html');
    assert.ok(existsSync(target), `footer links to ${href}, which is not built`);
  }
});

test('the footer lists every item page', () => {
  const hrefs = internal(links(home()));
  for (const slug of ASSET_SLUGS) {
    assert.ok(hrefs.includes(`/${slug}`), `footer is missing /${slug}`);
  }
});

test('the footer carries the legal pages and the journal', () => {
  const hrefs = internal(links(home()));
  for (const href of ['/terms', '/privacy', '/cookies', '/complaints', '/trust-and-security', '/blog']) {
    assert.ok(hrefs.includes(href), `footer is missing ${href}`);
  }
});

test('pages we have not built yet appear but are never linked', () => {
  const f = footer(home());
  const pending = [...f.matchAll(/class="tr-footer__pending">([^<]+)</g)].map((m) => m[1]);
  assert.ok(pending.length > 0, 'expected the planned-but-unbuilt entries to be listed');
  for (const label of pending) {
    assert.ok(
      !new RegExp(`<a[^>]*>\\s*${label}`).test(f),
      `${label} is marked pending but also linked`,
    );
  }
});

test('the footer carries contact details and a copyright line', () => {
  const f = footer(home());
  assert.match(f, /href="tel:/, 'no phone link in the footer');
  assert.match(text(f), /©\s*\d{4}/, 'no copyright line');
});

test('the logo actually ships', () => {
  const f = footer(home());
  const src = (f.match(/<img[^>]+src="([^"]+)"/) || [])[1];
  assert.ok(src, 'no logo in the footer');
  assert.ok(existsSync(resolve(dist, src.replace(/^\//, ''))), `${src} is not in the build`);

  // The masthead uses the same asset pipeline — a missing public/ breaks both.
  const head = home().slice(0, home().indexOf('</header>'));
  const logo = (head.match(/<img[^>]+src="(\/brand\/[^"]+)"/) || [])[1];
  assert.ok(logo && existsSync(resolve(dist, logo.replace(/^\//, ''))), `${logo} is not in the build`);
});

test('the same footer is on the item, legal and blog pages', () => {
  const reference = internal(links(home())).join('|');
  for (const slug of ['watches', 'terms', 'blog']) {
    assert.equal(internal(links(page(slug))).join('|'), reference, `${slug} has a different footer`);
  }
});
