import test from 'node:test';
import assert from 'node:assert/strict';
import { page, text, count, structuredData, DRAFT_SLUGS } from './helpers.mjs';

/*
 * Classic cars, Wine and Musical instruments were written straight into
 * Sanity as first drafts (scripts/add-item-pages.mjs), not migrated, so there
 * is no source file to compare against. These check they are whole pages on
 * the same template as the other seven, and that their drafts stay flagged.
 */

for (const slug of DRAFT_SLUGS) {
  test(`${slug}: a complete item page`, () => {
    const html = page(slug);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, 'h1 count');
    assert.match(html, /id="value-form"/, 'no valuation form');
    assert.equal(count(html, /class="how-step"/g), 4, 'how-it-works steps');
    assert.ok(structuredData(html).some((d) => d['@type'] === 'FinancialProduct' || d['@type'] === 'Service' || d.serviceType),
      'no service structured data');
  });

  test(`${slug}: unconfirmed claims and figures stay flagged`, () => {
    const html = page(slug);
    // The storage, transport and rate claims all carry review chips, and the
    // worked example keeps its bracketed placeholders.
    assert.ok(count(html, /class="confirm-chip"/g) >= 4, 'review chips are missing');
    const t = text(html);
    for (const placeholder of ['£[X,XXX]', '[XX.X]%']) {
      assert.ok(t.includes(placeholder), `lost ${placeholder}`);
    }
  });
}
