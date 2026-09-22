#!/usr/bin/env node
/**
 * Imports Stephano's guide copy (markdown) into Sanity as `guide` documents,
 * and makes sure the Guides page itself exists.
 *
 *   node scripts/import-guides.mjs --dry-run    print what would be written
 *   node scripts/import-guides.mjs              write to the dataset
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.
 *
 * Two rules from the brief:
 *   - Anything in [square brackets] is an unconfirmed figure and is kept
 *     exactly as written, brackets and all. Only [text](url) is a link.
 *   - "Notes in boxes" are for Jaime and Stephano, not the reader. Blockquotes
 *     and fenced blocks are treated as those boxes and left out; everything
 *     dropped is printed so nothing disappears silently.
 *
 * The guides index is only created if missing — once someone edits it in the
 * Studio, re-running this does not overwrite their copy. Guides themselves are
 * createOrReplace'd, so re-running after an edit in the Studio reverts it.
 */
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');

/** Source file → slug, order and the item pages it should point at. */
const GUIDES = [
  { file: 'Guide to Pawnbroking.md', slug: 'pawnbroking', order: 10, related: ['gold', 'watches', 'jewellery'] },
  { file: 'Trinity_Copy_Guide_TypesOfGold.md', slug: 'types-of-gold', order: 20, related: ['gold'] },
];
const SOURCE = process.env.GUIDES_DIR || resolve(process.env.HOME, 'Downloads');

const env = Object.fromEntries(
  (await readFile(resolve(root, '.env'), 'utf8'))
    .split('\n')
    .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
);

const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/** "**bold**, *italic* and [a link](https://…)" → spans + markDefs. */
export function inline(text, key) {
  const children = [];
  const markDefs = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let at = 0;
  let i = 0;
  let m;
  const span = (t, marks = []) => children.push({ _key: `${key}s${i++}`, _type: 'span', marks, text: t });
  while ((m = re.exec(text)) !== null) {
    if (m.index > at) span(text.slice(at, m.index));
    if (m[1] !== undefined) span(m[1], ['strong']);
    else if (m[2] !== undefined) span(m[2], ['em']);
    else {
      const mark = `${key}l${markDefs.length}`;
      markDefs.push({ _key: mark, _type: 'link', href: m[4] });
      span(m[3], [mark]);
    }
    at = m.index + m[0].length;
  }
  if (at < text.length) span(text.slice(at));
  if (!children.length) span('');
  return { children, markDefs };
}

/**
 * Markdown → { title, standfirst, body, dropped }.
 * The first `#` heading is the title; the first paragraph after it is the
 * standfirst. Paragraphs are joined across soft line breaks.
 */
export function parse(md, prefix) {
  const blocks = [];
  const dropped = [];
  let title = '';
  let standfirst = '';
  let n = 0;
  let para = [];
  let fence = null;

  const push = (style, text, listItem) => {
    const clean = text.trim();
    if (!clean) return;
    const key = `${prefix}${n++}`;
    const block = { _key: key, _type: 'block', style, ...inline(clean, key) };
    if (listItem) Object.assign(block, { listItem, level: 1 });
    blocks.push(block);
  };
  const flush = () => {
    if (!para.length) return;
    const text = para.join(' ');
    para = [];
    if (title && !standfirst && !blocks.length) standfirst = text.replace(/\*+/g, '');
    else push('normal', text);
  };

  for (const raw of md.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) {
      flush();
      if (fence) { dropped.push(fence.join('\n')); fence = null; } else fence = [];
      continue;
    }
    if (fence) { fence.push(raw); continue; }
    if (!line || /^(-{3,}|\*{3,}|_{3,})$/.test(line)) { flush(); continue; }
    if (line.startsWith('>')) { flush(); dropped.push(line); continue; }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flush();
      const text = heading[2].replace(/\*\*/g, '').trim();
      if (heading[1].length === 1 && !title) title = text;
      else push(heading[1].length <= 2 ? 'h2' : 'h3', text);
      continue;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) { flush(); push('normal', bullet[1], 'bullet'); continue; }
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) { flush(); push('normal', numbered[1], 'number'); continue; }
    para.push(line);
  }
  flush();
  if (fence) dropped.push(fence.join('\n'));
  return { title, standfirst, body: blocks, dropped };
}

const today = new Date().toISOString().slice(0, 10);
const docs = [];

for (const guide of GUIDES) {
  const md = await readFile(resolve(SOURCE, guide.file), 'utf8').catch(() => null);
  if (md === null) { console.log(`\n${guide.slug}: ${guide.file} not found in ${SOURCE} — skipped`); continue; }
  const { title, standfirst, body, dropped } = parse(md, `${guide.slug.replace(/\W/g, '')}b`);
  if (!title) throw new Error(`${guide.file}: no # title`);
  if (!standfirst) throw new Error(`${guide.file}: no opening paragraph to use as the standfirst`);

  const brackets = (md.match(/\[[^\]]+\](?!\()/g) || []);
  const kept = JSON.stringify(body) + standfirst + title;
  const lost = brackets.filter((b) => !kept.includes(b) && !dropped.join('\n').includes(b));
  if (lost.length) throw new Error(`${guide.file}: bracketed text lost: ${lost.join(', ')}`);

  console.log(`\n${guide.slug}: "${title}" — ${body.length} blocks, ${body.filter((b) => b.style === 'h2').length} sections, ${brackets.length} bracketed figures kept`);
  for (const d of dropped) console.log(`  left out (note): ${d.slice(0, 100).replace(/\n/g, ' ')}${d.length > 100 ? '…' : ''}`);

  docs.push({
    _id: `guide-${guide.slug}`,
    _type: 'guide',
    title,
    slug: { _type: 'slug', current: guide.slug },
    order: guide.order,
    standfirst,
    lastReviewed: today,
    body,
    relatedAssets: guide.related.map((slug) => ({ _key: slug, _type: 'reference', _ref: `assetPage-${slug}` })),
    seo: { _type: 'seo', title: `${title} — Trinity Pawnbrokers`, description: standfirst.slice(0, 155) },
  });
}

const index = {
  _id: 'guidesIndex',
  _type: 'guidesIndex',
  eyebrow: 'Guides',
  title: 'Guides',
  standfirst: 'Plain explanations of how pawnbroking works, and of the things we lend against.',
  seo: { _type: 'seo', title: 'Guides — Trinity Pawnbrokers', description: 'Plain guides to pawnbroking and the items we lend against, from Trinity Pawnbrokers.' },
};

if (DRY) {
  console.log('\n--dry-run: nothing written.');
  if (process.argv.includes('--print')) console.log(JSON.stringify(docs, null, 2));
} else {
  const ids = docs.flatMap((d) => d.relatedAssets.map((r) => r._ref));
  const existing = new Set(await client.fetch('*[_id in $ids]._id', { ids }));
  for (const d of docs) d.relatedAssets = d.relatedAssets.filter((r) => existing.has(r._ref));
  const tx = client.transaction().createIfNotExists(index);
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log(`\nWrote ${docs.length} guides; guides index ensured.`);
}
