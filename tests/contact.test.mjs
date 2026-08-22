import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dist, page, home, text, count, structuredData } from './helpers.mjs';

const contact = () => page('contact');

test('the contact page offers all three channels', () => {
  const html = contact();
  assert.equal(count(html, /class="contact-channel"/g), 3, 'expected phone, email and address');
  assert.match(html, /href="tel:\+442035671300"/, 'the phone is not dialable');
  assert.match(html, /href="mailto:support@unbolted\.com"/, 'the email is not a mailto');
  assert.match(text(html), /Token House/, 'no postal address');
});

test('opening hours are published, and only in one form', () => {
  // The hours the page states and the hours in the JSON-LD have to agree, or
  // Google shows one thing and the page another.
  const t = text(contact());
  assert.match(t, /9am to 5\.30pm/, 'weekday hours missing from the page');
  assert.match(t, /Closed at weekends/, 'closures missing from the page');

  const org = structuredData(contact()).find((b) => b['@type'] === 'FinancialService');
  assert.deepEqual(org.openingHours, ['Mo-Th 09:00-17:30', 'Fr 09:00-17:00']);
});

test('the page sends people somewhere better than the phone', () => {
  const html = contact();
  for (const href of ['/#index', '/complaints', '/faq']) {
    assert.ok(html.includes(`href="${href}"`), `no pointer to ${href}`);
  }
});

test('it is described as a ContactPage and points at the organisation', () => {
  const blocks = structuredData(contact());
  const cp = blocks.find((b) => b['@type'] === 'ContactPage');
  assert.ok(cp, 'no ContactPage block');
  assert.ok(cp.mainEntity?.['@id']?.endsWith('#organisation'));
  assert.ok(blocks.some((b) => b['@type'] === 'BreadcrumbList'), 'no breadcrumbs');
});

test('every internal link on the page resolves', () => {
  for (const [, href] of contact().matchAll(/href="(\/[^"#]*)/g)) {
    const target = href.includes('.')
      ? resolve(dist, href.replace(/^\//, ''))
      : resolve(dist, href.replace(/^\//, ''), 'index.html');
    assert.ok(existsSync(target), `contact links to ${href}, which is not in the build`);
  }
});

test('nothing still promises hours the business does not keep', () => {
  // The closing bands said "9am to 6pm" before the real hours were imported.
  for (const slug of ['index', 'contact', 'faq', 'about', 'watches']) {
    const html = slug === 'index' ? home() : page(slug);
    assert.ok(!/9am to 6pm/.test(text(html)), `${slug} still advertises 9am to 6pm`);
  }
});

test('the footer links to the contact page rather than listing it as pending', () => {
  const footer = home().slice(home().lastIndexOf('<footer'));
  assert.match(footer, /href="\/contact">Contact us/, 'contact is not linked in the footer');
});
