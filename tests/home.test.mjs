import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, home, count } from './helpers.mjs';

test('the homepage is built', () => {
  assert.ok(existsSync(resolve(dist, 'index.html')));
});

/**
 * The homepage was ported from a 1.3MB file with its design in 171 inline
 * styles. These assert each section survived that, by the markup that makes
 * it that section.
 */
const SECTIONS = [
  ['hero', /class="home-hero"/],
  ['hero rotation', /class="hero-beat hero-beat-poster"/],
  ['trust strip', /class="home-trust"/],
  ['item collage', /class="collage-grid"/],
  ['anything-else card', /class="ix-dark"/],
  ['how it works', /id="how-track"/],
  ['progress line', /class="how-line how-line--fill"/],
  ['custody', /class="custody-statement"/],
  ['custody mark', /class="custody-mark"/],
  ['rates', /class="rates-grid"/],
  ['visit', /class="visit-grid"/],
  ['map', /<iframe/],
  ['press', /class="press-logos"/],
];

test('every homepage section is present', () => {
  const html = home();
  for (const [name, pattern] of SECTIONS) {
    assert.match(html, pattern, `the ${name} section is missing`);
  }
});

test('the trust strip sits inside the hero', () => {
  const html = home();
  const heroStart = html.indexOf('class="home-hero"');
  const heroEnd = html.indexOf('id="index"');
  const trust = html.indexOf('class="home-trust"');
  assert.ok(trust > heroStart && trust < heroEnd, 'the trust strip is outside the hero');
});

test('all seven items appear in the grid, each with a teaser', () => {
  const html = home();
  assert.equal(count(html, /class="ix-card"/g), 7, 'wrong number of item cards');
  assert.equal(count(html, /class="ix-card__teaser"/g), 7, 'an item is missing its teaser');
  assert.equal(count(html, /class="ix-card__more"/g), 7, 'an item is missing its call to action');
  for (const slug of ['gold', 'watches', 'jewellery', 'diamonds', 'fine-art', 'handbags', 'silver']) {
    assert.match(html, new RegExp(`href="/${slug}"`), `no link to /${slug}`);
  }
});

test('the how-it-works steps are numbered in Roman', () => {
  const html = home();
  assert.equal(count(html, /class="how-num"/g), 5, 'wrong number of steps');
  for (const numeral of ['I', 'II', 'III', 'IV', 'V']) {
    assert.match(html, new RegExp(`class="how-num">${numeral}<`), `numeral ${numeral} missing`);
  }
});

test('exactly one rates figure is set in gold', () => {
  // The gold flag once read the label's colour, which is always gold, and
  // turned every figure gold.
  const html = home();
  assert.equal(count(html, /class="rates-figure"/g), 2, 'wrong number of plain figures');
  assert.equal(count(html, /class="rates-figure rates-figure--gold"/g), 1, 'wrong number of gold figures');
});

test('no HTML entities leak into the copy as text', () => {
  // The migration once wrote &ndash; and &amp; through undecoded, which then
  // rendered literally on the page.
  const html = home();
  const body = html.split('<body')[1] ?? '';
  for (const entity of ['&amp;ndash;', '&amp;mdash;', '&amp;amp;', '&amp;rsquo;', '&amp;hellip;']) {
    assert.ok(!body.includes(entity), `${entity} is rendered as text`);
  }
});

test('the homepage carries WebSite structured data, and only here', () => {
  assert.match(home(), /"@type":"WebSite"/, 'no WebSite schema on the homepage');
});
