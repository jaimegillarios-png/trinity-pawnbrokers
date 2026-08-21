import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { page, ASSET_SLUGS, count, root } from './helpers.mjs';

/**
 * Each section of the item page, asserted by the markup that makes it that
 * section. The proof section went missing entirely during the rebuild and
 * nothing noticed; these are the sentinels for that.
 */
const SECTIONS = [
  ['hero', /<section class="hero"/],
  ['valuation form', /id="value-form"/],
  ['trust strip', /<div class="trust">/],
  ['what we lend against', /<section id="index"/],
  ['what it costs', /class="borrow-grid"/],
  ['worked example', /class="tr-card tr-card--panel example-panel"/],
  ['how it works', /<section id="how"/],
  ['how-it-works stepper', /class="how-step"/],
  ['how we value', /class="value-split"/],
  ['why Trinity', /class="compare-grid"/],
  ['comparison headers', /class="cmp-head-tri"/],
  ['proof', /class="proof-grid"/],
  ['reviews badge', /data-reviews-badge/],
  ['FAQs', /class="faq-list"/],
  ['representative example', /class="rep-card"/],
  ['closing band', /<section class="closing">/],
  ['footer', /class="tr-footer"/],
];

for (const slug of ASSET_SLUGS) {
  test(`${slug}: every section is present`, () => {
    const html = page(slug);
    for (const [name, pattern] of SECTIONS) {
      assert.match(html, pattern, `${slug} is missing the ${name} section`);
    }
  });
}

test('the trust strip sits inside the hero, not after it', () => {
  // Its background is a translucent green that only reads correctly over the
  // hero image. Rendered as a sibling it comes out the wrong colour.
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const heroStart = html.indexOf('<section class="hero"');
    const heroEnd = html.indexOf('<section id="index"');
    const trust = html.indexOf('<div class="trust">');
    assert.ok(trust > heroStart && trust < heroEnd,
      `${slug}: the trust strip is outside the hero section`);
  }
});

test('the how-it-works steps are numbered and use both icon weights', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    assert.ok(count(html, /class="how-step"/g) >= 4, `${slug}: fewer than four steps`);
    assert.match(html, /how-step__label">Step 01</, `${slug}: steps are not numbered`);
    assert.ok(count(html, /class="ph-fill /g) >= 4, `${slug}: fill icons missing`);
  }
});

test('hidden form steps cannot block submission', () => {
  // Some pages legitimately require a step-one field (gold requires a weight).
  // The submit button lives in step two, so showing it hides step one — and a
  // required field inside a hidden pane blocks submission with an error
  // reported against an element nobody can see or focus. The step script
  // disables hidden panes, which takes them out of validation entirely.
  const script = readFileSync(resolve(root, 'src/scripts/asset-page.js'), 'utf8');
  assert.match(script, /el\.disabled = !isTarget/,
    'the step switcher no longer disables hidden panes');

  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const stepOne = html.split('data-step="1"')[1]?.split('data-step="2"')[0] ?? '';
    assert.ok(!/type="submit"/.test(stepOne), `${slug}: submit button is in step one`);
    if (/required/.test(stepOne)) {
      // Astro inlines small module scripts, so accept either form.
      assert.match(html, /<script type="module"/,
        `${slug}: has required step-one fields but loads no module script`);
    }
  }
});

test('no markup leaks into rendered copy', () => {
  // Compliance chips were written inline in the source content; a bad
  // conversion turned them into visible tags or stray asterisks.
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    assert.ok(!/&lt;span|&lt;em|&lt;br/.test(html), `${slug}: escaped HTML is visible in the copy`);
    assert.ok(!/\*[a-z][^*]{2,40}\*/i.test(html), `${slug}: unconverted emphasis markers in the copy`);
  }
});
