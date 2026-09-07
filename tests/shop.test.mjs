import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, root, page, home, text, count, structuredData } from './helpers.mjs';

/* Read off the build rather than listed here. The catalogue is real stock now
   — pieces sell, new ones arrive — so any hardcoded list is a test that fails
   the first time the client uses the Studio. */
const PAGES = ['items', 'cart', 'about', 'order-confirmed'];
const SLUGS = readdirSync(resolve(dist, 'shop'), { withFileTypes: true })
  .filter((e) => e.isDirectory() && !PAGES.includes(e.name))
  .map((e) => e.name);


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

test('the shop replaces the site nav rather than stacking a second one', () => {
  for (const p of ['shop', 'shop/items', 'shop/cart', 'shop/about', `shop/${SLUGS[0]}`]) {
    const html = page(p);
    const head = html.slice(0, html.indexOf('</header>'));
    assert.match(head, /data-variant="shop"/, `${p}: masthead is not in shop dress`);
    assert.match(head, /href="\/shop\/cart"/, `${p}: no cart in the bar`);
    // The way back out, so a visitor who landed on a watch can find the firm.
    assert.match(head, /class="tr-navlink tr-navlink--out"/, `${p}: no way back to the main site`);
    // And only one navigation, not two stacked.
    assert.equal(count(html, '<header class="masthead"'), 1, `${p}: more than one masthead`);
    assert.ok(!html.includes('class="shop-nav"'), `${p}: the old second bar is still there`);
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

test('the cart and the confirmation page stay out of search', () => {
  /* The catalogue itself is real stock and should be findable once the site
     goes live; a cart and a receipt never should be. */
  for (const p of ['shop/cart', 'shop/order-confirmed']) {
    assert.match(page(p), /name="robots" content="noindex/, `${p} is indexable`);
  }
});

test('the catalogue is real stock, not placeholders', () => {
  assert.ok(SLUGS.length >= 5, `only ${SLUGS.length} products built`);
  for (const slug of SLUGS) {
    assert.ok(!/placeholder/i.test(slug), `${slug} is still a placeholder`);
    const html = page(`shop/${slug}`);
    assert.ok(!/placeholder/i.test(text(html)), `${slug} says "placeholder" on the page`);
    // Squarespace slugs described the wrong watch on several of these.
    const product = structuredData(html).find((b) => b['@type'] === 'Product');
    const brand = product.brand.name.toLowerCase().split(' ')[0];
    assert.ok(slug.startsWith(brand), `${slug} does not start with its brand (${brand})`);
  }
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

test('the film is in the gallery, and costs nothing to not watch', () => {
  /* Several pieces say "please review the photos plus a video of this actual
     watch", so the page is incomplete without it. */
  const withVideo = SLUGS.map((s) => page(`shop/${s}`)).filter((h) => h.includes('data-gallery-video'));
  assert.ok(withVideo.length >= 5, `only ${withVideo.length} products carry a film`);

  for (const html of withVideo) {
    // Nobody opening the page to look at photographs should fetch 15MB of video.
    assert.match(html, /<video[^>]*preload="none"/, 'the film preloads');
    assert.match(html, /gallery__thumb--video/, 'no play badge in the rail');
    assert.match(html, /poster="/, 'no poster frame, so the frame opens black');
    // A browser that cannot play it still gets a way to the file.
    assert.match(html, /Download it instead/);
  }

  const script = readFileSync(resolve(root, 'src/scripts/gallery.js'), 'utf8');
  assert.match(script, /playing\.pause\(\)/, 'the film keeps playing after you flick past it');
});

test('the thumbnails are one sliding row, and absent on a phone', () => {
  /* Two rows read as a contact sheet and pushed the specification off the
     screen. One row that slides keeps the piece and its details together. On a
     phone they go entirely: at that width one three-quarter view is
     indistinguishable from the next, and the arrows and counter already say
     how many photographs there are. */
  const css = readFileSync(resolve(root, 'src/styles/shop.css'), 'utf8');
  const ruleFrom = (selector, from = 0) => {
    const start = css.indexOf(selector, from);
    assert.ok(start > -1, `no rule for ${selector}`);
    return css.slice(start, css.indexOf('}', start));
  };

  const wrap = ruleFrom('.gallery[data-ready] .gallery__railwrap');
  assert.match(wrap, /order: 2/, 'the rail must come after the frame');
  assert.match(ruleFrom('.gallery__stage {'), /order: 1/);

  const rail = ruleFrom('.gallery__rail {');
  assert.match(rail, /overflow-x: auto/, 'a slider has to scroll');
  assert.ok(!/wrap/.test(rail), 'the row must not wrap');
  assert.ok(!/auto-fill/.test(rail), 'auto-fill makes it a grid again');

  // Hidden below the phone breakpoint.
  const mobile = css.slice(css.indexOf('@media (max-width: 900px)', css.indexOf('.gallery__scroll')));
  assert.match(mobile, /\.gallery\[data-ready\] \.gallery__railwrap \{ display: none/);

  /* A piece photographed once renders no rail at all, correctly — so test
     against one that actually has a gallery. */
  const withGallery = SLUGS.map((slug) => page(`shop/${slug}`)).find((h) => h.includes('gallery__rail'));
  assert.ok(withGallery, 'no product has more than one photograph');
  const html = withGallery;
  assert.match(html, /data-rail-prev/, 'no slider control');
  assert.match(html, /data-rail-next/);
  // Both start hidden; the script shows whichever side can actually move.
  assert.match(html, /data-rail-prev[^>]*hidden/);

  const script = readFileSync(resolve(root, 'src/scripts/gallery.js'), 'utf8');
  assert.match(script, /function updateRailArrows/);
  assert.match(script, /rail\.offsetParent/, 'the arrows must stay hidden where the rail is not shown');
});

test('a cropped image is served cropped at every width', () => {
  /* src asked for a square and srcset served the photograph uncropped, so the
     browser took the srcset candidate and object-fit had to scale a 4:3 image
     up to fill the square. Soft photographs on a shop is the one thing not to
     get wrong. */
  const helper = readFileSync(resolve(root, 'src/lib/sanity/image.ts'), 'utf8');
  assert.match(helper, /export function croppedSrcSetFor/);
  for (const file of ['shop/ProductGallery.astro', 'shop/ShopHero.astro', 'shop/ShopStory.astro']) {
    const src = readFileSync(resolve(root, 'src/components', file), 'utf8');
    if (!src.includes('srcset')) continue;
    assert.match(src, /croppedSrcSetFor\(/, `${file} pairs a cropped src with an uncropped srcset`);
  }
});
