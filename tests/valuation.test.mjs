import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, page, ASSET_SLUGS } from './helpers.mjs';

const src = (p) => readFileSync(resolve(root, p), 'utf8');

test('every item page has a form that can actually be sent', () => {
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    const form = html.slice(html.indexOf('data-valuation'), html.indexOf('</form>', html.indexOf('data-valuation')));
    assert.match(form, /action="\/api\/valuation"/, `${slug}: posts somewhere else`);
    /* Without multipart a browser sends the photo input's filenames and none of
       the photos — which is how it was, alongside an endpoint that did not exist. */
    assert.match(form, /enctype="multipart\/form-data"/, `${slug}: photos would never be sent`);
    assert.match(form, new RegExp(`name="item" value="${slug}"`), `${slug}: request would not say what it is for`);
    assert.match(form, /name="wf-website"/, `${slug}: no spam trap`);
  }
});

test('Continue and Back name the step they go to', () => {
  /* Both were empty attributes. The stepper asked for step "", which matched no
     pane, so Continue hid both steps and left an empty card — nobody on any item
     page could reach the second step. */
  for (const slug of ASSET_SLUGS) {
    const html = page(slug);
    assert.match(html, /data-step-next="2"/, `${slug}: Continue has no target step`);
    assert.match(html, /data-step-back="1"/, `${slug}: Back has no target step`);
  }
  // And a bad value can never blank the form again.
  assert.match(src('src/scripts/asset-page.js'), /if \(!exists\) return;/);
});

test('the photo input stays reachable by keyboard', () => {
  /* It carried the `hidden` attribute, which takes an input out of the tab
     order: every field on the form could be reached except the photos. */
  const html = page('watches');
  const input = html.match(/<input[^>]*id="wf-photos"[^>]*>/)?.[0] ?? '';
  assert.ok(input, 'no photo input');
  assert.ok(!/\shidden[\s>]/.test(input), 'the photo input is hidden from keyboard users');
  assert.match(src('src/styles/asset-page.css'), /\.tr-dropzone:focus-within/, 'no focus state on the drop zone');
});

test('a request is stored where the public cannot read it', () => {
  /* Name, email, phone and photographs of something valuable. The dataset is
     public and its image assets list without a token, so photos must never be
     uploaded as assets; and the document id must carry a dot, which Sanity keeps
     out of anonymous reads. Both were proven against the live dataset. */
  const store = src('src/lib/valuation/store.ts');
  assert.match(store, /_id: `valuation\.\$\{request\.reference\}`/, 'the private id prefix is gone');
  assert.ok(!/assets\.upload/.test(store), 'photos are being uploaded as public assets');
  assert.ok(!/assets\.upload/.test(src('src/pages/api/valuation.ts')), 'the endpoint uploads public assets');
});

test('the endpoint refuses what it should and keeps quiet about spam', () => {
  const api = src('src/pages/api/valuation.ts');
  assert.match(api, /export const prerender = false/);
  assert.match(api, /Please give your name, email and phone number/);
  // A bot that fills the trap is told it succeeded, so it learns nothing.
  const trap = api.slice(api.indexOf("text(form, 'wf-website'"));
  assert.match(trap.slice(0, 300), /ok: true/);
  assert.ok(trap.indexOf('saveValuation') === -1 || trap.indexOf('ok: true') < trap.indexOf('saveValuation'));
  // Oversize photos are counted, not silently dropped.
  assert.match(api, /skippedPhotos: skipped/);
  // Both a script and a plain form post get an answer they can use.
  assert.match(api, /Response\.redirect\(new URL\(`\/valuation-received\?ref=/);
});

test('photos are shrunk before they are sent', () => {
  const script = src('src/scripts/valuation.js');
  assert.match(script, /var MAX_EDGE = 1600;/);
  assert.match(script, /imageOrientation: 'from-image'/, 'portrait phone photos would arrive sideways');
  assert.match(script, /toBlob\(/);
  /* The stepper disables the hidden step, so FormData(form) on submit loses step
     one — photos included. Values are read directly instead. */
  // Checked against the code with comments stripped — the comment explaining
  // why FormData(form) is not used would otherwise trip this.
  const code = script.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.ok(!/new FormData\(form\)/.test(code), 'FormData(form) drops every field on the hidden step');
  assert.match(code, /var data = new FormData\(\);/);
});

test('the confirmation replaces the form and makes no promise the site has not settled', () => {
  const html = page('watches');
  assert.match(html, /data-form-done hidden/, 'no confirmation panel');
  assert.match(html, /data-done-ref/);
  assert.match(html, /data-done-title[^>]*tabindex="-1"|tabindex="-1"[^>]*data-done-title/, 'focus cannot move to the confirmation');

  /* "Same-day", "1 business day" and "3 hours" all appear on the site. Until
     that is settled, the default confirmation must not add a fourth. */
  const component = src('src/components/ValuationForm.astro');
  const defaults = component.slice(component.indexOf('const confirmBody'), component.indexOf('---', 10));
  assert.ok(!/same.?day|business day|hours?\b|within/i.test(defaults), 'the default confirmation promises a timeframe');

  // The no-JavaScript landing page exists and stays out of search.
  const landing = page('valuation-received');
  assert.match(landing, /name="robots" content="noindex/);
});

test('staff can find requests in the Studio, and cannot fake one', () => {
  assert.match(src('studio/structure.ts'), /Valuation requests/);
  assert.match(src('studio/schemas/index.ts'), /valuationRequest,/);
  assert.match(src('studio/sanity.config.ts'), /t\.schemaType !== 'valuationRequest'/, 'staff could create requests by hand');
});
