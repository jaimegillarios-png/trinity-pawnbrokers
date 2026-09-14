import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { root } from './helpers.mjs';

const docsDir = resolve(root, 'studio/schemas/documents');
const structure = readFileSync(resolve(root, 'studio/structure.ts'), 'utf8');
const config = readFileSync(resolve(root, 'studio/sanity.config.ts'), 'utf8');
const index = readFileSync(resolve(root, 'studio/schemas/index.ts'), 'utf8');

/** Every document schema on disk, by its `name`. */
const types = readdirSync(docsDir)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => {
    const src = readFileSync(resolve(docsDir, f), 'utf8');
    const name = src.match(/name:\s*'([^']+)'/)?.[1];
    assert.ok(name, `${f} has no name`);
    /* Singleton means "opened as one document by single(S, …, type)" in the
       structure — not "has no slug". A valuation request has no slug and is
       very much a list, which is what broke the old guess. */
    return { file: f, name, isSingleton: new RegExp(`single\\(S,[^)]*'${name}'\\)`).test(structure) };
  });

test('every document schema is registered', () => {
  for (const { name } of types) {
    assert.match(index, new RegExp(`\\b${name}\\b`), `${name} is not in schemas/index.ts`);
  }
});

test('every document type is reachable in the Studio', () => {
  /* Registered is not the same as reachable. structure.ts is an explicit list,
     so a type missing from it is invisible to the person meant to edit it —
     which is how the whole shop, and five page singletons, were live on the
     site and unopenable in the Studio. */
  for (const { name } of types) {
    assert.match(structure, new RegExp(`'${name}'`), `${name} has no entry in structure.ts`);
  }
});

test('the shop catalogue is editable, and filtered by what is for sale', () => {
  assert.match(structure, /schemaType\('product'\)/, 'no product list');
  for (const status of ['available', 'reserved', 'sold']) {
    assert.match(
      structure,
      new RegExp(`status == "${status}"`),
      `no "${status}" view — staff cannot see at a glance what is on sale`,
    );
  }
});

test('single-document types cannot be duplicated or deleted', () => {
  /* The site reads these as *[_type == "…"][0]. A second copy renders nowhere
     and is invisibly wrong, so the actions are taken away rather than left to
     surprise someone. */
  const listed = config.slice(config.indexOf('const SINGLETONS'), config.indexOf('export default'));
  for (const { name, isSingleton, file } of types) {
    if (!isSingleton) continue;
    assert.match(listed, new RegExp(`'${name}'`), `${file} is a singleton but is not protected`);
  }
});

test('types with a slug are lists, not singletons', () => {
  const listed = config.slice(config.indexOf('const SINGLETONS'), config.indexOf('export default'));
  for (const { name, isSingleton } of types) {
    if (isSingleton) continue;
    assert.ok(!new RegExp(`'${name}'`).test(listed), `${name} has a slug; it cannot be a singleton`);
  }
});

test('the checkout hold is never hand-edited', () => {
  /* Written by the checkout route and cleared by the webhook. Someone clearing
     it by hand mid-session would put a watch back on sale that another buyer
     is part-way through paying for. */
  const product = readFileSync(resolve(docsDir, 'product.ts'), 'utf8');
  const hold = product.slice(product.indexOf("name: 'hold'"));
  assert.match(hold.slice(0, 400), /readOnly: true/);
});
