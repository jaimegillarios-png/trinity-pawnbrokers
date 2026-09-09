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

  /* The arrows are overlaid, not in the flow. Beside the rail they pushed the
     row inwards by their own width, so the first thumbnail did not start where
     the photograph above it started. */
  const arrow = ruleFrom('.gallery__scroll {');
  assert.match(arrow, /position: absolute/, 'an arrow in the flow insets the row');
  assert.match(wrap, /position: relative/, 'the overlaid arrows need a containing block');
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
  /* The defect is a mismatch, not the absence of a helper: when `src` asks
     Sanity for a crop but `srcset` serves the photograph uncropped, the
     browser takes the srcset candidate, so the crop never applies and
     object-fit has to scale the image up to fill the frame. Serving both
     uncropped and letting CSS crop is equally consistent — it is what the
     About masthead does, and now what the shop hero does. */
  const helper = readFileSync(resolve(root, 'src/lib/sanity/image.ts'), 'utf8');
  assert.match(helper, /export function croppedSrcSetFor/);

  for (const file of ['shop/ProductGallery.astro', 'shop/ShopHero.astro', 'shop/ShopStory.astro']) {
    const src = readFileSync(resolve(root, 'src/components', file), 'utf8');
    if (!src.includes('srcset')) continue;
    const cropsInSrc = /\.fit\('crop'\)/.test(src);
    const cropsInSrcSet = src.includes('croppedSrcSetFor(');
    assert.equal(
      cropsInSrc,
      cropsInSrcSet,
      `${file}: src ${cropsInSrc ? 'crops' : 'does not crop'} but srcset ${cropsInSrcSet ? 'does' : 'does not'}`,
    );
  }
});

test('the product column is ruled once per spec row and nowhere else', () => {
  /* It had a rule above the table, one under every row including the last, and
     a third above the closing line — at two different opacities, so the column
     read as ruled paper. The line now sits on top of each row, which gives the
     table its opening rule for free and lets it end on white. */
  const css = readFileSync(resolve(root, 'src/styles/shop.css'), 'utf8');
  const rule = (selector) => {
    const start = css.indexOf(selector);
    assert.ok(start > -1, `no rule for ${selector}`);
    return css.slice(start, css.indexOf('}', start));
  };
  assert.ok(!/border/.test(rule('.product__specs {')), 'the table wrapper still draws a rule');
  assert.ok(!/border/.test(rule('.product__assurance {')), 'the closing line still draws a rule');
  assert.match(rule('.product__spec {'), /border-top: 1px solid var\(--tr-line-soft\)/);
  assert.ok(!/border-bottom/.test(rule('.product__spec {')), 'rows must not rule both edges');

  /* One column, value under its label. Set as two, the values were ranged
     right against a ragged left edge, so a long one wrapped into a shape that
     had nothing to do with its label and the eye crossed the gap every row. */
  assert.ok(!/justify-content: space-between/.test(rule('.product__spec {')), 'the row is two columns again');
  assert.ok(!/text-align: right/.test(rule('.product__spec dd {')), 'the value is ranged right again');
});

test('the breadcrumb does not sit in a band of its own', () => {
  /* Every .tr-band draws a rule beneath itself to divide alternating grounds.
     A white breadcrumb band above a white product band drew a line between two
     identical surfaces and boxed the breadcrumb in against the masthead's own
     rule. */
  const html = page(`shop/${SLUGS[0]}`);
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const bands = main.match(/class="tr-band[^"]*"/g) ?? [];
  assert.equal(bands.length, 1, `the product page has ${bands.length} bands: ${bands.join(', ')}`);
  assert.match(main, /class="product-crumbs"/, 'no breadcrumb');
  assert.ok(!/tr-band[^"]*product-crumbs/.test(main), 'the breadcrumb is still its own band');
});

test('the shop hero is built like the About masthead', () => {
  /* A split panel on warm ground, not a photograph with the headline laid over
     it. Practical as well as visual: the catalogue is shot on white, and no
     scrim over that makes white text legible — which is what the dark hero it
     replaced was fighting. */
  const shop = readFileSync(resolve(root, 'src/styles/shop.css'), 'utf8');
  const about = readFileSync(resolve(root, 'src/styles/about.css'), 'utf8');
  const rule = (css, selector) => {
    const start = css.indexOf(selector);
    assert.ok(start > -1, `no rule for ${selector}`);
    return css.slice(start, css.indexOf('}', start));
  };

  // The two must agree on the things that make it the same treatment.
  for (const [shopSel, aboutSel, props] of [
    ['.shop-hero {', '.about-masthead {', ['background']],
    ['.shop-hero__inner {', '.about-masthead__inner {', ['padding', 'grid-template-columns', 'gap']],
    ['.shop-hero__title {', '.about-masthead__title {', ['font', 'color', 'max-width']],
  ]) {
    const a = rule(shop, shopSel);
    const b = rule(about, aboutSel);
    for (const prop of props) {
      const grab = (css) => css.match(new RegExp(`${prop}:\\\\s*([^;]+);`))?.[1].trim();
      assert.equal(grab(a), grab(b), `${shopSel} and ${aboutSel} disagree on ${prop}`);
    }
  }

  // The emphasis is the gold underline, not the old gold italic.
  assert.match(rule(shop, '.shop-hero__title em'), /text-decoration: underline/);

  const html = page('shop');
  assert.match(html, /class="shop-hero__figure"/, 'no square plate');
  assert.ok(!/shop-hero__media/.test(html), 'the full-bleed hero is still being served');
  // Unlike About, the shop keeps its buttons.
  assert.match(html, /shop-hero__actions/);
});

test('the shop home offers one action, and the story lives on its own page', () => {
  const home = page('shop');
  const about = page('shop/about');

  /* One button in the hero. The second offered a different errand — selling
     rather than buying — to someone who had just arrived to look at watches. */
  const hero = home.slice(home.indexOf('shop-hero__actions'), home.indexOf('</section>', home.indexOf('shop-hero__actions')));
  assert.equal((hero.match(/class="tr-cta/g) ?? []).length, 1, 'the hero has more than one button');

  // The story belongs on /shop/about, not on the front page as well.
  assert.ok(!/class="[^"]*\bshop-story\b/.test(home), 'the story is still on the shop home');
  assert.match(about, /class="[^"]*\bshop-story\b/, 'the story has gone missing from /shop/about');

  /* The way through to the rest of the catalogue is a button now, and it needs
     its parent in the selector: .tr-cta sets `border: none`, ties on
     specificity and wins on stylesheet order. Unscoped, it rendered with the
     padding and no border at all. */
  assert.match(home, /class="tr-cta shop-featured__all"/);
  const css = readFileSync(resolve(root, 'src/styles/shop.css'), 'utf8');
  assert.match(css, /\.tr-inner \.shop-featured__all \{/, 'the secondary button is not scoped');
});
