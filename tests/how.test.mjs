import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, home, text, count, structuredData } from './helpers.mjs';

const how = () => page('how-it-works');

test('the page carries all five steps in order', () => {
  const html = how();
  assert.equal(count(html, /class="how-step"/g), 5);
  const nums = [...html.matchAll(/class="how-step__num">Step (\d+)</g)].map((m) => m[1]);
  assert.deepEqual(nums, ['01', '02', '03', '04', '05'], 'the steps are not numbered in order');
});

test('every step has a node with an icon, and a timing', () => {
  // The rail is drawn from the nodes, so a step without one breaks the line.
  const html = how();
  assert.equal(count(html, /class="how-step__node"/g), 5, 'a step is missing its node');
  assert.equal(count(html, /class="ph-light ph-[a-z-]+"/g) >= 5, true, 'a node has no icon');
  assert.equal(count(html, /class="how-step__timing"/g), 5, 'a step is missing its timing');
});

test('the steps go out as HowTo structured data', () => {
  const howTo = structuredData(how()).find((b) => b['@type'] === 'HowTo');
  assert.ok(howTo, 'no HowTo block');
  assert.equal(howTo.step.length, 5);
  assert.deepEqual(howTo.step.map((s) => s.position), [1, 2, 3, 4, 5]);
  for (const step of howTo.step) {
    assert.ok(step.text?.length > 40, `step "${step.name}" has no usable text`);
  }
});

test('the figures are stated once, in one table', () => {
  const html = how();
  assert.equal(count(html, /class="how-terms__row"/g), 7, 'expected seven figures');
  const t = text(html);
  for (const fact of ['From £500', 'Six months', 'None, and no footprint']) {
    assert.ok(t.includes(fact), `the terms table has lost "${fact}"`);
  }
});

test('the risk warning is on the page, not buried', () => {
  // FCA-regulated lending: the consequence of not repaying has to be stated
  // plainly, and this is the page that explains the term.
  const t = text(how());
  assert.match(t, /may be sold/i, 'no plain statement that the item can be sold');
  assert.match(t, /no credit check|not reported to any credit agency|no footprint/i);
});

test('all three ends of a term are covered', () => {
  const t = text(how());
  for (const outcome of ['You repay', 'You extend', 'You do neither']) {
    assert.ok(t.includes(outcome), `the page does not say what happens if ${outcome.toLowerCase()}`);
  }
});

test('the nav and footer point at the page, not at the homepage fragment', () => {
  for (const slug of ['index', 'faq', 'about']) {
    const html = slug === 'index' ? home() : page(slug);
    const head = html.slice(0, html.indexOf('</header>'));
    assert.ok(head.includes('href="/how-it-works"'), `${slug}: nav still points elsewhere`);
    assert.ok(!head.includes('href="/#how"'), `${slug}: the fragment link is still in the nav`);
  }
  const footer = home().slice(home().lastIndexOf('<footer'));
  assert.match(footer, /href="\/how-it-works">How it works/, 'the footer entry is still unlinked');
});

test('every internal link on the page resolves', () => {
  for (const [, href] of how().matchAll(/href="(\/[^"#]*)/g)) {
    const target = href.includes('.')
      ? resolve(dist, href.replace(/^\//, ''))
      : resolve(dist, href.replace(/^\//, ''), 'index.html');
    assert.ok(existsSync(target), `how-it-works links to ${href}, which is not in the build`);
  }
});
