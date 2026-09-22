#!/usr/bin/env node
/**
 * Imports Stephano's guide build specs into Sanity as `guide` documents, and
 * sets up the /guides page itself.
 *
 *   node scripts/import-guides.mjs --dry-run    print what would be written
 *   node scripts/import-guides.mjs              write to the dataset
 *
 * Needs SANITY_API_WRITE_TOKEN in .env. Reads the specs from GUIDES_DIR
 * (default: the Trinity folder in iCloud Drive).
 *
 * The specs are more than copy — they carry metadata, schema, diagrams and a
 * checklist too. Only the section between the H1 and the end of the copy is
 * page content; everything else is for us. Within it, the spec's own rules:
 *
 *   - Anything in [square brackets] is an unconfirmed figure and is shown
 *     exactly as written. The script fails if a single one goes missing.
 *   - Blockquotes are notes to us and never reach the page. A few of them ask
 *     for a treatment ("give it a callout", "box this"), which is applied.
 *   - Headings carry their level in the text ("H2: …", "H3: …").
 *   - The copy is not edited. Links are added only where the spec names an
 *     anchor phrase that is actually in the copy.
 *
 * Guides are createOrReplace'd: re-running reverts edits made in the Studio.
 */
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const SOURCE = process.env.GUIDES_DIR
  || resolve(process.env.HOME, 'Library/Mobile Documents/com~apple~CloudDocs/Diseño/Trinity Pawnbrokers');

const ASSET_LINKS = {
  Gold: '/gold', Watches: '/watches', Jewellery: '/jewellery', Diamonds: '/diamonds',
  Silver: '/silver', 'Fine art': '/fine-art', 'Designer handbags': '/handbags',
};

/**
 * Per guide: where the copy starts and stops, and what the spec sets outside
 * the copy itself (title tag, description, hub card, the foot's button).
 * The hub descriptions are the spec's own words, verbatim.
 */
const GUIDES = [
  {
    file: 'Guide to Pawnbroking.md',
    slug: 'pawnbroking',
    order: 1,
    from: /^#+\s*H1:/,
    to: /^## Diagrams and imagery/,
    seo: {
      title: 'How Pawnbroking Works in the UK: A Plain Guide | Trinity',
      description: 'What a pawnbroker does, what a pawn loan costs, what happens if you cannot repay, and what the Consumer Credit Act entitles you to. Written by valuers.',
    },
    summary: 'How a pawn loan actually runs, from valuation to redemption. What a pawnbroker can and cannot do under the Consumer Credit Act, what the loan costs, what happens if you cannot repay, and when a pawn loan is the wrong choice.',
    ctaHref: '/what-we-lend-against',
    assetTable: true,
    links: [
      ['watch loans', '/watches'],
      ['silver loans', '/silver'],
    ],
    sourceLinks: {
      'Consumer Credit Act 1974': 'https://www.legislation.gov.uk/ukpga/1974/39/part/VIII/crossheading/pledges',
      'Realisation of Pawn': 'https://www.legislation.gov.uk/uksi/1983/1568/made',
      'pawnbroking sector review': 'https://www.fca.org.uk/publications/multi-firm-reviews/pawnbroking-sector-review',
      'Financial Services Register': 'https://register.fca.org.uk/',
    },
  },
  {
    file: 'Trinity_Copy_Guide_TypesOfGold.md',
    slug: 'types-of-gold',
    order: 2,
    from: /^#+\s*H1:/,
    to: /^# 4\. Notes/,
    seo: {
      title: 'Types of Gold: Carat, Hallmarks and Purity | Trinity',
      description: 'What 375, 585, 750 and 916 mean, how to read a UK hallmark, and why Asian, Indian, Italian and American gold differ in purity and colour. From our valuers.',
    },
    summary: 'Why Italian, Asian, Indian and British gold differ in colour and purity, what hallmarks tell you, and how purity and weight translate into a loan. Written for people lending against pieces that have been in the family.',
    ctaHref: '/gold#value-form',
    assetTable: false,
    links: [
      ['guide to how pawnbroking works', '/guides/pawnbroking'],
    ],
    sourceLinks: {},
  },
];

const INDEX = {
  _id: 'guidesIndex',
  _type: 'guidesIndex',
  title: 'Guides',
  standfirst: 'Straightforward explanations of how pawnbroking works, what it costs and how items are valued, written by the people who do the valuing. No sales pitch, and no assumption that you have done this before.',
  cta: { label: 'Request a valuation', href: '/what-we-lend-against' },
  seo: {
    _type: 'seo',
    title: 'Guides to Pawnbroking, Gold and Valuation | Trinity',
    description: "Plain guides to how pawnbroking works, what pawn loans cost, how items are valued, and the different types of gold, written by Trinity's valuers.",
  },
};

/* ---------- markdown → Portable Text ---------- */

/** Code ticks and markdown escapes are formatting, not copy. Brackets stay. */
const clean = (t) => t.replace(/`/g, '').replace(/\\([[\]])/g, '$1').trim();

/** "**bold**, *italic* and [a link](https://…)" → spans + markDefs. */
function inline(text, key, links = []) {
  // Named anchor phrases become links, first occurrence only.
  for (const [phrase, href] of links) {
    if (text.includes(phrase) && !text.includes(`[${phrase}](`)) text = text.replace(phrase, `[${phrase}](${href})`);
  }
  const children = [];
  const markDefs = [];
  // A link needs "](" straight after the bracket, so [X,XXX] is left alone.
  const re = /\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
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

function copyRange(md, guide) {
  const lines = md.replace(/\r/g, '').split('\n');
  const start = lines.findIndex((l) => guide.from.test(l));
  const stop = lines.findIndex((l, i) => i > start && guide.to.test(l));
  if (start < 0 || stop < 0) throw new Error(`${guide.file}: could not find the copy section`);
  return { lines, start, stop };
}

function parse(md, guide) {
  const { lines, start, stop } = copyRange(md, guide);

  const prefix = guide.slug.replace(/\W/g, '');
  let n = 0;
  const k = () => `${prefix}${n++}`;
  const block = (style, text, listItem) => {
    const key = k();
    const b = { _key: key, _type: 'block', style, ...inline(clean(text), key, guide.links) };
    if (listItem) Object.assign(b, { listItem, level: 1 });
    return b;
  };

  const out = {
    title: clean(lines[start].replace(/^#+\s*H1:\s*/, '')),
    standfirst: '',
    body: [],
    signature: '',
    sources: [],
    closing: [],
    ctaLabel: '',
    notes: [],
  };

  // Where copy is going: the body, or one of the foot's fields.
  let mode = 'body';
  let expectStandfirst = false;
  let para = [];
  let table = null;
  let sinceHeading = 0; // index in body of the first block after the last heading
  let faq = null;

  const emit = (b) => { out.body.push(b); };

  const flushTable = () => {
    if (!table) return;
    const rows = table
      .filter((r) => !/^\|\s*:?-{3,}/.test(r))
      .map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => clean(c)));
    emit({
      _key: k(),
      _type: 'dataTable',
      rows: rows.map((cells, ri) => ({
        _key: `r${ri}`,
        _type: 'row',
        cells: cells.map((text, ci) => {
          const plain = text.replace(/\*\*/g, '');
          const href = guide.assetTable && ri > 0 && ci === 0 ? ASSET_LINKS[plain] : undefined;
          return { _key: `c${ci}`, _type: 'cell', text: plain, ...(href ? { href } : {}) };
        }),
      })),
    });
    table = null;
  };

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(' ').trim();
    para = [];
    if (!text) return;

    if (expectStandfirst) { out.standfirst = clean(text).replace(/\*\*/g, ''); expectStandfirst = false; return; }
    if (/^\*\*Standfirst:?\*\*:?$/.test(text)) { expectStandfirst = true; return; }

    if (mode === 'signature') { out.signature = clean(text); return; }
    if (mode === 'closing') {
      const cta = clean(text).match(/^\*\*\[\s*(.+?)\s*\]\*\*$/);
      if (cta) out.ctaLabel = cta[1];
      else out.closing.push(clean(text).replace(/\*\*/g, ''));
      return;
    }
    if (mode === 'faq') {
      const qa = text.match(/^\*\*(.+?\?)\*\*\s*(.+)$/);
      if (!qa) throw new Error(`${guide.file}: a quick answer without a question: ${text.slice(0, 60)}`);
      const key = k();
      faq.items.push({
        _key: key,
        _type: 'qa',
        question: clean(qa[1]),
        answer: [{ _key: `${key}a`, _type: 'block', style: 'normal', ...inline(clean(qa[2]), `${key}a`, guide.links) }],
      });
      return;
    }
    if (mode === 'glossary') {
      // One run-on paragraph in the spec; one entry per paragraph on the page.
      for (const entry of text.split(/\s+(?=\*\*[^*]+\*\*\s·)/)) emit(block('normal', entry));
      return;
    }
    emit(block('normal', text));
  };

  const flush = () => { flushPara(); flushTable(); };

  /** A note that asks for a treatment wraps what it refers to in a box. */
  const applyNote = (note) => {
    out.notes.push(note);
    if (/figures correct as at/i.test(note)) {
      emit(block('small', 'Figures correct as at [DATE].'));
      return;
    }
    const verbatim = /box this/i.test(note);
    if (!verbatim && !/visual weight|callout|visually distinct/i.test(note)) return;
    // What the note is about: from a bold label paragraph if there is one
    // since the last heading ("Representative example"), else everything
    // since the heading.
    let from = sinceHeading;
    for (let i = out.body.length - 1; i >= sinceHeading; i--) {
      const b = out.body[i];
      if (b._type === 'block' && b.children.length === 1 && b.children[0].marks.includes('strong')) { from = i; break; }
    }
    const wrapped = out.body.splice(from);
    if (!wrapped.length) return;
    emit({ _key: k(), _type: 'callout', tone: verbatim ? 'verbatim' : 'highlight', body: wrapped });
  };

  for (let li = start + 1; li < stop; li++) {
    const line = lines[li].trim();

    if (line.startsWith('|')) { flushPara(); (table ??= []).push(line); continue; }
    if (table) flushTable();

    if (!line || /^(-{3,}|\*{3,}|_{3,})$/.test(line)) { flushPara(); continue; }
    if (line.startsWith('>')) {
      flush();
      applyNote(line.replace(/^>\s*/, ''));
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flush();
      const text = clean(heading[2]).replace(/\*\*/g, '');
      const level = text.match(/^H([1-6]):\s*(.*)$/);
      if (level) {
        mode = 'body';
        emit(block(level[1] === '2' ? 'h2' : 'h3', level[2]));
        sinceHeading = out.body.length;
        continue;
      }
      if (/^Copy, part/i.test(text)) continue;
      if (/^Glossary$/i.test(text)) { mode = 'glossary'; emit(block('h2', text)); sinceHeading = out.body.length; continue; }
      if (/^Quick answers$/i.test(text)) {
        mode = 'faq';
        emit(block('h2', text));
        faq = { _key: k(), _type: 'faqList', items: [] };
        emit(faq);
        sinceHeading = out.body.length;
        continue;
      }
      if (/^Signature$/i.test(text)) { mode = 'signature'; continue; }
      if (/^Sources/i.test(text)) { mode = 'sources'; continue; }
      if (/^Closing$/i.test(text)) { mode = 'closing'; continue; }
      throw new Error(`${guide.file}: a heading with no level: "${text}"`);
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const text = (bullet ?? numbered)[1];
      if (mode === 'sources') {
        const label = clean(text);
        const hit = Object.entries(guide.sourceLinks).find(([needle]) => label.includes(needle));
        out.sources.push({ _key: `src${out.sources.length}`, _type: 'source', label, ...(hit ? { href: hit[1] } : {}) });
      } else {
        emit(block('normal', text, bullet ? 'bullet' : 'number'));
      }
      continue;
    }
    para.push(line);
  }
  flush();
  return out;
}

/* ---------- checks ---------- */

/** Every bracketed placeholder in the copy section must survive, verbatim. */
function checkBrackets(md, guide, doc) {
  const { lines, start, stop } = copyRange(md, guide);
  const copy = lines.slice(start, stop).filter((l) => !l.trim().startsWith('>')).join('\n');
  const wanted = (clean(copy).match(/\[[^\]\n]+\](?!\()/g) ?? [])
    .filter((b) => !/^\[\s*(Request a valuation|Value my gold)\s*\]$/.test(b));
  const onPage = JSON.stringify(doc);
  const lost = wanted.filter((b) => !onPage.includes(JSON.stringify(b).slice(1, -1)));
  if (lost.length) throw new Error(`${guide.file}: bracketed text lost: ${lost.join(', ')}`);
  return wanted.length;
}

/* ---------- run ---------- */

const env = Object.fromEntries(
  (await readFile(resolve(root, '.env'), 'utf8'))
    .split('\n')
    .map((line) => line.match(/^([A-Z_]+)=(.*)$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
);

const docs = [];
for (const guide of GUIDES) {
  const md = await readFile(resolve(SOURCE, guide.file), 'utf8').catch(() => null);
  if (md === null) throw new Error(`${guide.file} not found in ${SOURCE}`);
  const p = parse(md, guide);
  if (!p.standfirst) throw new Error(`${guide.file}: no standfirst`);

  const doc = {
    _id: `guide-${guide.slug}`,
    _type: 'guide',
    title: p.title,
    slug: { _type: 'slug', current: guide.slug },
    order: guide.order,
    standfirst: p.standfirst,
    summary: guide.summary,
    body: p.body,
    signature: p.signature,
    sources: p.sources,
    closing: p.closing.join('\n\n'),
    cta: { label: p.ctaLabel, href: guide.ctaHref },
    seo: { _type: 'seo', ...guide.seo },
  };
  const brackets = checkBrackets(md, guide, doc);

  const count = (style) => p.body.filter((b) => b.style === style).length;
  console.log(`\n${guide.slug}: "${p.title}"`);
  console.log(`  ${count('h2')} sections, ${count('h3')} sub-sections, ${p.body.filter((b) => b._type === 'dataTable').length} tables, ${p.body.filter((b) => b._type === 'callout').length} boxes, ${p.body.find((b) => b._type === 'faqList')?.items.length ?? 0} quick answers, ${p.sources.length} sources`);
  console.log(`  ${brackets} bracketed placeholders, all kept`);
  console.log(`  button: "${p.ctaLabel}" → ${guide.ctaHref}`);
  console.log(`  ${p.notes.length} notes left off the page`);
  docs.push(doc);
}

if (DRY) {
  console.log('\n--dry-run: nothing written.');
  if (process.argv.includes('--print')) console.log(JSON.stringify(docs, null, 2));
} else {
  const client = createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-10-01',
    token: env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });
  const tx = client.transaction().createOrReplace(INDEX);
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log(`\nWrote ${docs.length} guides and the guides page.`);
}
