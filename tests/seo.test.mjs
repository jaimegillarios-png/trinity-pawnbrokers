import { test } from 'node:test';
import assert from 'node:assert/strict';
import { page, ASSET_SLUGS, structuredData } from './helpers.mjs';

test('every page has a unique, well-formed title and description', () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];

    assert.ok(title, `${slug}: no title`);
    assert.ok(desc, `${slug}: no meta description`);
    assert.ok(!titles.has(title), `${slug}: duplicate title "${title}"`);
    assert.ok(!descriptions.has(desc), `${slug}: duplicate description`);
    titles.add(title);
    descriptions.add(desc);

  }
});

test('titles and descriptions fit in a search result', () => {
  // Google truncates beyond roughly these lengths. Reported together, because
  // one long description usually means the whole set needs a pass.
  const long = [];
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    if (title.length > 70) long.push(`${slug}: title ${title.length} chars (max 70)`);
    if (desc.length > 165) long.push(`${slug}: description ${desc.length} chars (max 165)`);
  }
  assert.deepEqual(long, [], `these will be cut off in search results:\n  ${long.join('\n  ')}\n`);
});

test('every page declares a canonical URL and is indexable', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    assert.ok(canonical, `${slug}: no canonical link`);
    assert.ok(canonical.endsWith(`/${slug}`), `${slug}: canonical points at ${canonical}`);
    assert.match(html, /<meta name="robots" content="index, follow/, `${slug}: not indexable`);
  }
});

test('social cards are complete', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name']) {
      assert.ok(html.includes(`property="${prop}"`), `${slug}: missing ${prop}`);
    }
    assert.ok(html.includes('name="twitter:card"'), `${slug}: missing twitter card`);
  }
});

test('structured data is present, valid and complete', () => {
  for (const slug of ASSET_SLUGS) {
    const blocks = structuredData(page(slug)); // throws if any block is malformed JSON
    const types = blocks.map((b) => b['@type']);

    assert.ok(types.includes('FinancialService'), `${slug}: no FinancialService`);
    assert.ok(types.includes('Service'), `${slug}: no Service`);
    assert.ok(types.includes('BreadcrumbList'), `${slug}: no BreadcrumbList`);
    assert.ok(types.includes('FAQPage'), `${slug}: no FAQPage`);

    const org = blocks.find((b) => b['@type'] === 'FinancialService');
    assert.equal(org.identifier?.name, 'FCA Firm Reference Number',
      `${slug}: the FCA reference is not published as an identifier`);
    assert.ok(org.identifier?.value, `${slug}: FCA reference is empty`);

    const faq = blocks.find((b) => b['@type'] === 'FAQPage');
    assert.ok(faq.mainEntity.length >= 5, `${slug}: only ${faq.mainEntity.length} FAQs in schema`);
  }
});

test('the FCA authorisation is published on every item page', () => {
  // The migration once wrote the regulatory footer as an empty string and the
  // page rendered happily with no authorisation statement on it at all.
  //
  // The visible statement was removed from the footer by design decision, so
  // this now guards the machine-readable half. The *visible* FCA authorisation
  // statement still needs a home before launch — see docs/launch-checklist.
  for (const slug of ASSET_SLUGS) {
    const org = structuredData(page(slug)).find((b) => b['@type'] === 'FinancialService');
    assert.ok(org, `${slug}: no FinancialService block`);
    assert.match(String(org.identifier?.value ?? ''), /^\d{6}$/,
      `${slug}: FCA reference is missing or malformed`);
  }
});
