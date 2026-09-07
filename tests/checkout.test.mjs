import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, root, page } from './helpers.mjs';

/* `isBuyable` is the whole defence against selling a one-of-a-kind watch to two
   people, so it is tested as logic rather than through the page. Imported from
   the TypeScript source via a tiny transpile-free re-read: the function is pure
   and its body is plain JavaScript. */
const stock = readFileSync(resolve(root, 'src/lib/shop/stock.ts'), 'utf8');
const body = stock.slice(
  stock.indexOf('export function isBuyable'),
  stock.indexOf('export async function fetchForCheckout'),
);
const isBuyable = new Function(
  `${body.replace('export function isBuyable(item: StockItem, now = Date.now()): boolean', 'function isBuyable(item, now = Date.now())')}; return isBuyable;`,
)();

const HOUR = 3600_000;
const now = Date.parse('2026-01-01T12:00:00Z');
const item = (over = {}) => ({ status: 'available', ...over });

test('an available piece with no hold can be bought', () => {
  assert.equal(isBuyable(item(), now), true);
});

test('a sold or reserved piece cannot be bought, hold or no hold', () => {
  assert.equal(isBuyable(item({ status: 'sold' }), now), false);
  assert.equal(isBuyable(item({ status: 'reserved' }), now), false);
});

test('a live hold blocks a second buyer', () => {
  const held = item({ hold: { sessionId: 'cs_1', expiresAt: '2026-01-01T12:20:00Z' } });
  assert.equal(isBuyable(held, now), false);
});

test('an expired hold releases the piece without anyone touching it', () => {
  const lapsed = item({ hold: { sessionId: 'cs_1', expiresAt: '2026-01-01T11:40:00Z' } });
  assert.equal(isBuyable(lapsed, now), true);
});

test('a hold expiring this instant is over', () => {
  const edge = item({ hold: { sessionId: 'cs_1', expiresAt: '2026-01-01T12:00:00Z' } });
  assert.equal(isBuyable(edge, now), true);
});

test('a malformed hold date does not accidentally free the piece', () => {
  /* Date.parse of nonsense is NaN, and every comparison with NaN is false — so
     the item stays unbuyable. Asserted because the opposite would be silent. */
  const broken = item({ hold: { sessionId: 'cs_1', expiresAt: 'not a date' } });
  assert.equal(isBuyable(broken, now), false);
});

test('the hold and the Stripe session expire together', () => {
  const route = readFileSync(resolve(root, 'src/pages/api/checkout.ts'), 'utf8');
  assert.match(route, /expires_at: Math\.floor\(expiresAt\.getTime\(\) \/ 1000\)/);
  assert.match(stock, /HOLD_MINUTES = 30/);
});

test('the checkout route never takes a price from the browser', () => {
  const route = readFileSync(resolve(root, 'src/pages/api/checkout.ts'), 'utf8');
  assert.ok(!/body\.(price|amount|total)/.test(route), 'route reads a price off the request');
  assert.match(route, /unit_amount: item\.price/, 'price should come from the CMS record');
});

test('the webhook refuses an unsigned payload', () => {
  const hook = readFileSync(resolve(root, 'src/pages/api/stripe-webhook.ts'), 'utf8');
  assert.match(hook, /stripe-signature/);
  assert.match(hook, /status: 400/);
  // Nothing may be marked sold before the signature has been checked.
  assert.ok(
    hook.indexOf('verifyWebhook') < hook.indexOf('markSold'),
    'markSold is reachable before the signature is verified',
  );
});

test('only the server routes go through the Worker', () => {
  const routes = JSON.parse(readFileSync(resolve(dist, '_routes.json'), 'utf8'));
  assert.deepEqual(routes.exclude, [], 'an exclude list can go stale; use include only');
  for (const route of ['/api/checkout', '/api/stripe-webhook', '/shop/order-confirmed']) {
    assert.ok(routes.include.includes(route), `${route} must reach the Worker`);
    assert.ok(routes.include.includes(`${route}/`), `${route}/ must reach the Worker too`);
  }
  // The bug this replaced: prerendered pages being routed through the Worker.
  assert.ok(!routes.include.some((r) => r === '/*'), 'the Worker must not catch everything');
  assert.ok(!routes.include.includes('/about'), 'prerendered pages must not reach the Worker');
});

test('the cart can actually be checked out', () => {
  const html = page('shop/cart');
  assert.match(html, /data-checkout\b/, 'no checkout button');
  assert.ok(!/cart__checkout[^>]*\bdisabled/.test(html), 'the checkout button is still disabled');
  assert.match(html, /data-checkout-error/, 'nothing to show a refusal in');
});

test('the cart still carries prices from the server, never from storage', () => {
  const html = page('shop/cart');
  assert.match(html, /data-price="\d+"/);
  const cart = readFileSync(resolve(root, 'src/scripts/cart.js'), 'utf8');
  assert.ok(!/price/i.test(cart.split('*/').slice(1).join('*/')), 'the cart store touches prices');
});

test('checkout sends slugs and nothing else', () => {
  const script = readFileSync(resolve(root, 'src/scripts/cart-page.js'), 'utf8');
  assert.match(script, /JSON\.stringify\(\{ slugs: slugs \}\)/);
});

test('the confirmation page is server-rendered, so it cannot be faked from cache', () => {
  const src = readFileSync(resolve(root, 'src/pages/shop/order-confirmed.astro'), 'utf8');
  assert.match(src, /export const prerender = false/);
  assert.ok(
    !existsSync(resolve(dist, 'shop/order-confirmed/index.html')),
    'the confirmation page was prerendered',
  );
});

test('the cart page drops a piece that sold while the cart sat open', () => {
  /* Only buyable pieces get a row, so a slug with no row is one that has since
     sold. Left alone it would count towards the badge and show nothing — a
     cart claiming three items and listing two. */
  const script = readFileSync(resolve(root, 'src/scripts/cart-page.js'), 'utf8');
  assert.match(script, /TrinityCart\.remove\(slug\)/);
  assert.match(script, /pruning/, 'removing re-enters render; it needs a guard');

  const html = page('shop/cart');
  const rows = [...html.matchAll(/data-cart-item="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(rows.length, 'no cart rows were rendered');
  assert.ok(
    !rows.includes('breitling-navitimer-placeholder'),
    'a sold piece has a cart row, so it would never be pruned',
  );
});

test('a misconfigured deploy refuses checkout rather than half-completing one', () => {
  const route = readFileSync(resolve(root, 'src/pages/api/checkout.ts'), 'utf8');
  const guard = route.indexOf("'STRIPE_SECRET_KEY', 'SANITY_API_WRITE_TOKEN'");
  assert.ok(guard > 0, 'no secret check');
  assert.ok(guard < route.indexOf('stripeFor(env)'), 'Stripe is reached before the check');
  assert.match(route, /503/);
});

test('reading stock needs no credential, writing it does', () => {
  /* The dataset is public. Keeping the token off the read means a checkout can
     still tell a buyer an item has gone even if the write token is wrong. */
  const src = readFileSync(resolve(root, 'src/lib/shop/stock.ts'), 'utf8');
  assert.match(src, /\.\.\.\(write \? \{ token: require_\(env, 'SANITY_API_WRITE_TOKEN'\) \} : \{\}\)/);
  for (const fn of ['hold', 'markSold', 'release']) {
    const body = src.slice(src.indexOf(`export async function ${fn}`));
    assert.match(body.slice(0, 400), /client\(env, true\)/, `${fn} must use the write client`);
  }
});

test('a hold is only ever cleared for the session that took it', () => {
  const src = readFileSync(resolve(root, 'src/lib/shop/stock.ts'), 'utf8');
  for (const fn of ['markSold', 'release']) {
    const body = src.slice(src.indexOf(`export async function ${fn}`));
    assert.match(body.slice(0, 600), /hold\.sessionId == \$sessionId/, `${fn} matches too broadly`);
  }
  // Releasing must not resurrect something already sold.
  const release = src.slice(src.indexOf('export async function release'));
  assert.match(release.slice(0, 600), /status == "available"/);
});
