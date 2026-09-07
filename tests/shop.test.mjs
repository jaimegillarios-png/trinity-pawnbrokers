import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, home, text, count, structuredData } from './helpers.mjs';

const SLUGS = [
  'rolex-air-king-placeholder',
  'omega-speedmaster-placeholder',
  'cartier-santos-placeholder',
  'tudor-black-bay-placeholder',
  'jaeger-lecoultre-reverso-placeholder',
  'breitling-navitimer-placeholder',
];


/* Which piece is in which state is live CMS data — a real sale moves a slug
   from one bucket to the next, and a test that names one breaks for a reason
   that has nothing to do with the code. So the buckets are read back off the
   built pages, and the assertions are about behaviour per state. */
const byStatus = () => {
  const out = { available: [], reserved: [], sold: [] };
  for (const slug of SLUGS) {
    const p = structuredData(page(`shop/${slug}`)).find((b) => b['@type'] === 'Product');
    const a = p?.offers?.availability ?? '';
    if (a.endsWith('InStock')) out.available.push(slug);
    else if (a.endsWith('LimitedAvailability')) out.reserved.push(slug);
    else if (a.endsWith('SoldOut')) out.sold.push(slug);
  }
  return out;
};

test('every shop page builds', () => {
  for (const p of ['shop', 'shop/items', 'shop/cart', ...SLUGS.map((s) => `shop/${s}`)]) {
    assert.ok(existsSync(resolve(dist, p, 'index.html')), `${p} did not build`);
  }
});

test('the shop is reachable from the site nav and the footer', () => {
  const html = home();
  const head = html.slice(0, html.indexOf('</header>'));
  assert.ok(head.includes('href="/shop"'), 'no shop link in the masthead');
  const footer = html.slice(html.lastIndexOf('<footer'));
  assert.ok(footer.includes('href="/shop"'), 'no shop link in the footer');
});

test('the shop carries its own nav, with the cart in it', () => {
  for (const p of ['shop', 'shop/items', 'shop/cart', `shop/${SLUGS[0]}`]) {
    const html = page(p);
    assert.ok(html.includes('class="shop-nav"'), `${p}: no shop nav`);
    assert.ok(html.includes('href="/shop/cart"'), `${p}: no cart link`);
  }
});

test('a sold piece cannot be added to a cart', () => {
  // The only guard that matters on a catalogue of unique items.
  const { available, reserved, sold } = byStatus();
  assert.ok(sold.length, 'no sold piece in the catalogue to test against');
  assert.ok(available.length, 'nothing is for sale, so the add button is untestable');

  for (const slug of sold) {
    const html = page(`shop/${slug}`);
    assert.ok(!html.includes('data-add-to-cart'), `${slug}: a sold piece still offers an add button`);
    assert.match(text(html), /has been sold/i, slug);
  }
  for (const slug of reserved) {
    const html = page(`shop/${slug}`);
    assert.ok(!html.includes('data-add-to-cart'), `${slug}: a reserved piece still offers an add button`);
  }
  for (const slug of available) {
    assert.match(page(`shop/${slug}`), new RegExp(`data-add-to-cart="${slug}"`), slug);
  }
});

test('prices are only ever rendered by the server', () => {
  // The cart stores slugs, never prices, so a price cannot be edited in
  // localStorage and carried into a total.
  const cartScript = page('shop/cart');
  assert.match(cartScript, /data-price="\d+"/, 'the cart rows carry no server-rendered price');

  const cartJs = resolve(dist, '_astro');
  assert.ok(existsSync(cartJs), 'no bundled scripts');
});

test('each piece is published as a Product with the right availability', () => {
  for (const slug of SLUGS) {
    const product = structuredData(page(`shop/${slug}`)).find((b) => b['@type'] === 'Product');
    assert.ok(product, `${slug}: no Product block`);
    assert.match(
      product.offers.availability,
      /schema\.org\/(InStock|LimitedAvailability|SoldOut)$/,
      `${slug}: availability is not one Google recognises`,
    );
    assert.equal(product.offers.priceCurrency, 'GBP');
    assert.match(product.offers.price, /^\d+\.\d{2}$/, `${slug}: price is not a plain amount`);
  }

  // The page and its structured data must agree — that is the real risk here.
  const { available, sold } = byStatus();
  for (const slug of sold) assert.match(text(page(`shop/${slug}`)), /sold/i, slug);
  for (const slug of available) assert.ok(page(`shop/${slug}`).includes('data-add-to-cart'), slug);
});

test('placeholder stock is kept out of search', () => {
  // Invented prices and references must not be indexed.
  for (const slug of SLUGS) {
    assert.match(page(`shop/${slug}`), /name="robots" content="noindex/, `${slug} is indexable`);
  }
  assert.match(page('shop/cart'), /name="robots" content="noindex/, 'the cart is indexable');
});

test('the cart page states the delivery and cancellation terms', () => {
  const t = text(page('shop/cart'));
  assert.match(t, /fourteen days/i, 'no cancellation period stated');
  assert.match(t, /insured/i, 'no delivery terms stated');
});

test('every internal shop link resolves', () => {
  for (const p of ['shop', 'shop/items', 'shop/cart', `shop/${SLUGS[0]}`]) {
    for (const [, href] of page(p).matchAll(/href="(\/[^"#]*)/g)) {
      const target = href.includes('.')
        ? resolve(dist, href.replace(/^\//, ''))
        : resolve(dist, href.replace(/^\//, ''), 'index.html');
      assert.ok(existsSync(target), `${p} links to ${href}, which is not in the build`);
    }
  }
});
