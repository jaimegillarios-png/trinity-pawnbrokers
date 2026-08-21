#!/usr/bin/env node
/**
 * Generates the theme config from the design tokens.
 *
 *   src/styles/trinity-tokens.json  ->  src/styles/trinity-theme.js
 *
 * tokens.json is the single source of truth (see docs/WORKFLOW.md). Never hand-edit
 * the generated file — change the tokens and re-run:  node scripts/build-theme.mjs
 *
 * The output is shaped to drop straight into a Tailwind `theme.extend`, and is a
 * plain ES module so it can also be imported by any JS/CSS-in-JS consumer.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'src/styles/trinity-tokens.json');
const OUT = resolve(root, 'src/styles/trinity-theme.js');

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
// tokens.json holds either a bare value or a { value, use } descriptor.
const val = (v) => (v && typeof v === 'object' && 'value' in v ? v.value : v);

const t = JSON.parse(await readFile(SRC, 'utf8'));

// --- colours: flatten one level, `green.vault` -> `green-vault` -------------
const colors = {};
for (const [group, entries] of Object.entries(t.color)) {
  for (const [name, v] of Object.entries(entries)) {
    // `neutral.white` etc. read better unprefixed; the rest keep their group.
    const key = group === 'neutral' || group === 'status' ? kebab(name) : `${kebab(group)}-${kebab(name)}`;
    colors[key] = val(v);
  }
}

// --- type: `{size, line}` -> Tailwind's [size, {lineHeight}] tuple ---------
const fontSize = {};
const fontWeight = {};
const letterSpacing = {};
for (const [name, spec] of Object.entries(t.type)) {
  const key = kebab(name);
  fontSize[key] = [spec.size, { lineHeight: String(spec.line ?? 1.2) }];
  if (spec.weight) fontWeight[key] = String(spec.weight);
  if (spec.track && !spec.track.includes('-')) letterSpacing[key] = spec.track; // skip ranges
}

const fontFamily = Object.fromEntries(
  Object.entries(t.font).map(([k, v]) => [k, v.split(',').map((s) => s.trim().replace(/^'|'$/g, ''))])
);

// --- space & shape ---------------------------------------------------------
const isRange = (v) => typeof v === 'string' && /\d-\d|\d+px-\d+px/.test(v);
const spacing = {};
const maxWidth = {};
for (const [k, v] of Object.entries(t.space)) {
  if (isRange(v)) continue; // e.g. gapCol "48px-64px" — a guideline, not a token
  (k === 'container' || k === 'reading' ? maxWidth : spacing)[kebab(k)] = v;
}
const borderRadius = { DEFAULT: t.shape.radius, chip: t.shape.radiusChip };
const boxShadow = { 'on-green': t.shape.shadowOnGreen, 'on-light': t.shape.shadowOnLight };

const theme = { colors, fontFamily, fontSize, fontWeight, letterSpacing, spacing, maxWidth, borderRadius, boxShadow };

const banner = `// GENERATED FILE — do not edit.
// Source: src/styles/trinity-tokens.json
// Regenerate: node scripts/build-theme.mjs
`;
const body = Object.entries(theme)
  .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2)};`)
  .join('\n\n');
const footer = `\nexport default { ${Object.keys(theme).join(', ')} };\n`;

await writeFile(OUT, `${banner}\n${body}\n${footer}`, 'utf8');

const counts = Object.entries(theme).map(([k, v]) => `${Object.keys(v).length} ${k}`).join(', ');
console.log(`theme written -> src/styles/trinity-theme.js (${counts})`);
