import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, text, count, structuredData, ASSET_SLUGS } from './helpers.mjs';

const faq = () => page('faq');

test('the FAQ page builds with every group and question', () => {
  const html = faq();
  assert.equal(count(html, /class="faq-group"/g), 4, 'expected four question groups');
  assert.equal(count(html, /class="faq-list"/g), 4, 'each group needs its own accordion');
  assert.equal(count(html, /class="faq-item"/g), 24, 'expected 24 questions');
});

test('every question is published as structured data', () => {
  // The whole reason this page earns its keep: the questions can appear in
  // Google directly. One block for the page, not one per group.
  const blocks = structuredData(faq()).filter((b) => b['@type'] === 'FAQPage');
  assert.equal(blocks.length, 1, 'expected exactly one FAQPage block');
  assert.equal(blocks[0].mainEntity.length, 24, 'not every question reached the schema');
  for (const entry of blocks[0].mainEntity) {
    assert.ok(entry.name?.length > 5, 'a question is empty');
    assert.ok(entry.acceptedAnswer?.text?.length > 20, `answer too short for "${entry.name}"`);
  }
});

test('the accordion starts closed here and open on the item pages', () => {
  // Four groups each opening an answer would push the last off the screen, so
  // /faq opts out. The item pages keep the original behaviour.
  assert.equal(count(faq(), /data-faq-start-closed/g), 4, '/faq should start closed');
  assert.ok(!page('watches').includes('data-faq-start-closed'), 'item pages should start open');
});

test('the shared accordion styles and script are not trapped on the item pages', () => {
  // They lived in asset-page.css and asset-page.js, which /faq does not load —
  // the same shape as the bug that shipped every item page unstyled.
  for (const slug of ['faq', ...ASSET_SLUGS]) {
    const html = page(slug);
    assert.ok(/<link rel="stylesheet"[^>]+_astro\/[^"]+\.css/.test(html) || html.includes('.faq-list'),
      `${slug}: no stylesheet carrying the accordion`);
    assert.match(html, /<script type="module"[^>]*src="[^"]*\.js"|<script type="module">/,
      `${slug}: no script to drive the accordion`);
  }
});

test('answers carry the figures they were sourced with', () => {
  const t = text(faq());
  for (const fact of ['£500', 'six months', '£25,000', 'four working hours', 'Faster Payments']) {
    assert.ok(t.includes(fact), `the FAQ has lost "${fact}"`);
  }
});

test('trust and security is retired and redirects to how it works', () => {
  assert.ok(!existsSync(resolve(dist, 'trust-and-security', 'index.html')), 'the retired page is still built');
  const redirects = readFileSync(resolve(dist, '_redirects'), 'utf8');
  assert.match(redirects, /^\/trust-and-security\s+\/how-it-works\s+301$/m);
});

test('the closing band is styled on every page that uses it', () => {
  // ClosingBand.astro is shared by /about and /faq, but its CSS lived in
  // about.css — which /faq does not import, so the band rendered as unstyled
  // text on a white page. The styles are in trinity-components.css now, which
  // every page loads.
  for (const slug of ['about', 'faq']) {
    const html = page(slug);
    assert.ok(html.includes('class="closing-band"'), `${slug}: no closing band`);
    assert.ok(!html.includes('about-closing'), `${slug}: still on the page-scoped class`);
  }
});

test('the accordion can animate', () => {
  const html = page('faq');
  // A hidden attribute cannot be transitioned. Open state is an attribute on
  // the item and the panel animates its grid row, so both have to be present.
  assert.ok(!/class="faq-a"[^>]*hidden/.test(html), 'the answer is still hidden-attribute driven');
  assert.equal(count(html, /class="faq-panel"/g), 24, 'every answer needs its animated panel');
  // The toggle is drawn in CSS; a typed +/- cannot be transitioned.
  assert.ok(!/class="faq-toggle"[^>]*>[+\u2212]/.test(html), 'the toggle is still a typed character');
});
