import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, text, count, structuredData } from './helpers.mjs';

const about = () => page('about');

test('the about page builds with every section', () => {
  const html = about();
  for (const [name, selector] of [
    ['masthead', 'class="about-masthead"'],
    ['record plaque', 'class="about-plaque"'],
    ['photographic plate', 'class="about-plate"'],
    ['trust strip', 'class="trust"'],
    ['why', 'class="about-why'],
    ['Trinity & Unbolted', 'class="about-firm"'],
    ['the bench', 'class="bench-grid"'],
    ['principles', 'class="principle-grid"'],
    ['closing', 'class="about-closing"'],
  ]) {
    assert.ok(html.includes(selector), `no ${name} section`);
  }
});

test('the bench and the principles are fully populated', () => {
  const html = about();
  assert.equal(count(html, /class="tr-card"/g), 10, 'expected 6 disciplines and 4 principles');
  // Every card carries an icon — a missing one leaves a silent gap in the grid.
  assert.equal(count(html, /class="ph-light ph-[a-z-]+ tr-card__icon"/g), 10);
});

test('the page carries its own stylesheet', () => {
  // about.css is imported by the route, not by Base. If that import is ever
  // dropped the page still type-checks and renders as unstyled text.
  assert.ok(
    /<link rel="stylesheet"[^>]+_astro\/[^"]+\.css/.test(about()) || about().includes('.about-masthead'),
    'about.css did not reach the page',
  );
});

test('the Trinity/Unbolted explanation names the regulated entity', () => {
  const t = text(about());
  assert.match(t, /Open Access Finance Ltd/, 'the regulated entity is not named');
  assert.match(t, /741896/, 'the FCA reference is missing');
  assert.match(t, /Unbolted/, 'Unbolted is not explained');
});

test('the about page is described to search engines as an AboutPage', () => {
  const blocks = structuredData(about());
  const aboutSchema = blocks.find((b) => b['@type'] === 'AboutPage');
  assert.ok(aboutSchema, 'no AboutPage block');
  assert.ok(aboutSchema.mainEntity?.['@id']?.endsWith('#organisation'),
    'AboutPage does not point at the organisation');
  assert.ok(blocks.some((b) => b['@type'] === 'BreadcrumbList'), 'no breadcrumbs');
});

test('the hero emphasis is rendered, not left as asterisks', () => {
  const html = about();
  assert.ok(!/\*[^*<>]+\*/.test(text(html)), 'an *emphasis* marker reached the page as text');
  assert.match(html, /<h1[^>]*class="about-masthead__title"[\s\S]*?<em>/, 'no emphasised run in the h1');
});

test('every about-page link points somewhere that exists', () => {
  for (const [, href] of about().matchAll(/href="(\/[^"#]*)/g)) {
    const target = href.endsWith('/') || !href.includes('.')
      ? resolve(dist, href.replace(/^\//, ''), 'index.html')
      : resolve(dist, href.replace(/^\//, ''));
    assert.ok(existsSync(target), `about page links to ${href}, which is not in the build`);
  }
});

test('the record plaque carries the establishment facts', () => {
  const html = about();
  const plaque = html.slice(html.indexOf('about-plaque'), html.indexOf('about-plate'));
  assert.equal(count(plaque, /<dt>/g), 4, 'expected four rows on the plaque');
  for (const fact of ['2013', '741896', 'Unbolted', 'City of London']) {
    assert.ok(plaque.includes(fact), `the plaque does not carry ${fact}`);
  }
});

test('the about page does not reuse the item-page hero', () => {
  // The whole point of the masthead: the other eight pages open with a
  // photograph, a scrim and the headline laid over it. This one does not.
  const html = about();
  assert.ok(!html.includes('class="hero"'), 'the item-page hero came back');
  assert.ok(!html.includes('hero__scrim'), 'the about page is using a scrimmed hero');
  // The trust strip belongs to the plate, and the plate follows the type.
  assert.ok(
    html.indexOf('about-masthead') < html.indexOf('about-plate'),
    'the plate should follow the masthead, not precede it',
  );
});
