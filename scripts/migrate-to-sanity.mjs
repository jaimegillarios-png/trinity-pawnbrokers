#!/usr/bin/env node
/**
 * One-way import of the hand-built site's content into Sanity.
 *
 *   node scripts/migrate-to-sanity.mjs --dry-run    inspect without writing
 *   node scripts/migrate-to-sanity.mjs              write to the dataset
 *
 * Needs a write token:
 *   sanity.io/manage -> API -> Tokens -> Editor
 *   export SANITY_API_WRITE_TOKEN=...
 *
 * Idempotent: document IDs are derived from the slug and written with
 * createOrReplace, so running it twice does not duplicate anything. Images are
 * content-hashed, so re-runs reuse the asset already in Sanity rather than
 * uploading it again.
 */
import { createClient } from '@sanity/client';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) fail('PUBLIC_SANITY_PROJECT_ID is not set.');
if (!token && !DRY) fail('SANITY_API_WRITE_TOKEN is not set. Use --dry-run to inspect without it.');

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2026-01-01', token, useCdn: false });

/* ---------- images ---------------------------------------------------- */

const uploaded = new Map();

async function uploadImage(relPath, alt) {
  if (!relPath) return undefined;
  const abs = resolve(root, relPath);
  let buffer;
  try {
    buffer = await readFile(abs);
  } catch {
    console.warn(`  ! missing image, skipped: ${relPath}`);
    return undefined;
  }
  const hash = createHash('sha1').update(buffer).digest('hex');
  if (!uploaded.has(hash)) {
    if (DRY) {
      uploaded.set(hash, `image-DRYRUN-${hash.slice(0, 8)}`);
    } else {
      const asset = await client.assets.upload('image', buffer, { filename: basename(abs) });
      uploaded.set(hash, asset._id);
      console.log(`  + uploaded ${relPath}`);
    }
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: uploaded.get(hash) }, alt };
}

/* ---------- shape helpers -------------------------------------------- */

const keyed = (items, prefix) =>
  (items ?? []).map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

const intro = (s) =>
  s ? { eyebrow: s.eyebrow, heading: s.heading, intro: s.intro } : undefined;

/** Legacy `fields: [[f, f], [f, f], [f]]` becomes rows of the formRow object. */
const toRows = (rows, prefix) =>
  (rows ?? []).map((fields, i) => ({
    _key: `${prefix}${i}`,
    _type: 'formRow',
    fields: fields.map((f, j) => ({
      _key: `${prefix}${i}f${j}`,
      _type: 'formField',
      id: f.id,
      label: f.label,
      type: f.type ?? 'text',
      optional: Boolean(f.optional),
      ...(f.placeholder ? { placeholder: f.placeholder } : {}),
      ...(f.options ? { options: f.options } : {}),
      ...(f.autocomplete ? { autocomplete: f.autocomplete } : {}),
    })),
  }));

/** Step 2 was hard-coded in the old template; it becomes editable content. */
const contactRows = () => [
  {
    _key: 's2r0',
    _type: 'formRow',
    fields: [
      { _key: 's2r0f0', _type: 'formField', id: 'wf-name', label: 'Full name', type: 'text', autocomplete: 'name' },
    ],
  },
  {
    _key: 's2r1',
    _type: 'formRow',
    fields: [
      { _key: 's2r1f0', _type: 'formField', id: 'wf-email', label: 'Email address', type: 'email', autocomplete: 'email' },
      { _key: 's2r1f1', _type: 'formField', id: 'wf-phone', label: 'Phone number', type: 'tel', autocomplete: 'tel' },
    ],
  },
];

/**
 * The old hero heading carried markup for the gold, underscored item name.
 * Sanity holds plain text with *asterisks*, and the template decides what
 * that looks like — so the CMS never stores HTML.
 */
const deMarkup = (html = '') =>
  html
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '*$1*')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/* ---------- build documents ------------------------------------------ */

async function buildAssetPage(content, order) {
  const heroImage = await uploadImage(content.hero?.image?.src, content.hero?.image?.alt);
  return {
    _id: `assetPage-${content.slug}`,
    _type: 'assetPage',
    title: content.noun.plural.replace(/^./, (c) => c.toUpperCase()),
    slug: { _type: 'slug', current: content.slug },
    order,
    nounSingular: content.noun.singular,
    nounPlural: content.noun.plural,
    cardImage: heroImage,
    hero: {
      _type: 'heroSection',
      image: heroImage,
      eyebrow: content.hero.eyebrow,
      heading: deMarkup(content.hero.heading),
      intro: deMarkup(content.hero.intro),
      ctaPrimary: { _type: 'cta', ...content.hero.ctaPrimary },
      ctaGhost: content.hero.ctaGhost ? { _type: 'cta', ...content.hero.ctaGhost } : undefined,
      reassurance: content.hero.reassurance,
    },
    trust: keyed(
      (content.trust ?? []).map((t) => ({ _type: 'trustItem', text: t.text, chip: t.chip })),
      'trust',
    ),
    lendAgainst: {
      intro: intro(content.lendAgainst),
      cards: keyed((content.lendAgainst?.cards ?? []).map((c) => ({ _type: 'iconCard', ...c })), 'la'),
    },
    borrow: {
      intro: intro(content.borrow),
      specs: keyed((content.borrow?.specs ?? []).map((s) => ({ _type: 'specRow', ...s })), 'spec'),
      example: content.borrow?.example
        ? {
            _type: 'workedExample',
            label: content.borrow.example.label,
            chip: content.borrow.example.chip,
            statement: deMarkup(content.borrow.example.statement),
            rows: keyed(
              (content.borrow.example.rows ?? []).map((r) => ({ _type: 'ledgerRow', ...r })),
              'ex',
            ),
            note: deMarkup(content.borrow.example.note),
          }
        : undefined,
    },
    how: {
      intro: intro(content.how),
      steps: keyed((content.how?.steps ?? []).map((s) => ({ _type: 'iconCard', ...s })), 'how'),
      link: content.how?.link ? { _type: 'cta', ...content.how.link } : undefined,
    },
    valuation: {
      intro: intro(content.valuation),
      points: keyed((content.valuation?.points ?? []).map((p) => ({ _type: 'iconCard', ...p })), 'val'),
    },
    why: {
      intro: intro(content.why),
      rows: keyed((content.why?.rows ?? []).map((r) => ({ _type: 'compareRow', ...r })), 'why'),
    },
    proof: {
      reviewsNote: deMarkup(content.proof?.reviewsNote),
      caseStudy: content.proof?.caseStudy
        ? {
            _type: 'caseStudy',
            label: deMarkup(content.proof.caseStudy.label),
            statement: deMarkup(content.proof.caseStudy.statement),
            rows: keyed(
              (content.proof.caseStudy.rows ?? []).map((r) => ({ _type: 'ledgerRow', ...r })),
              'cs',
            ),
            note: deMarkup(content.proof.caseStudy.note),
          }
        : undefined,
    },
    faqs: {
      intro: intro(content.faqs),
      items: keyed((content.faqs?.items ?? []).map((f) => ({ _type: 'faqItem', ...f })), 'faq'),
    },
    closing: content.closing
      ? {
          _type: 'closingSection',
          eyebrow: content.closing.eyebrow,
          heading: content.closing.heading,
          intro: deMarkup(content.closing.intro),
          cta: content.closing.cta ? { _type: 'cta', ...content.closing.cta } : undefined,
          contactPrefix: content.closing.contactPrefix,
          contactSuffix: content.closing.contactSuffix,
        }
      : undefined,
    form: {
      _type: 'valuationForm',
      heading: content.form.heading,
      intro: deMarkup(content.form.intro),
      stepOneLabel: content.form.stepLabels?.[1],
      stepTwoLabel: content.form.stepLabels?.[2],
      stepOneRows: toRows(content.form.fields, 's1r'),
      stepTwoRows: contactRows(),
      photosLabel: content.form.photos?.label,
      photosHint: content.form.photos?.hint,
      continueLabel: content.form.continueLabel,
      backLabel: content.form.backLabel,
      submitLabel: content.form.submitLabel,
      noteStep1: deMarkup(content.form.noteStep1),
      noteStep2: deMarkup(content.form.noteStep2),
    },
    repExample: content.repExample
      ? {
          _type: 'repExample',
          label: content.repExample.label,
          chip: content.repExample.chip,
          statement: deMarkup(content.repExample.statement),
          note: deMarkup(content.repExample.note),
        }
      : undefined,
    complianceNote: content.specimenBar,
    seo: {
      _type: 'seo',
      title: content.meta.title,
      description: content.meta.description,
      noIndex: false,
    },
  };
}

async function buildSiteSettings() {
  const mod = await import(pathToFileURL(resolve(root, 'legacy/src/templates/trinity.config.mjs')).href);
  const cfg = mod.site ?? mod.default ?? {};
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: cfg.name ?? 'Trinity Pawnbrokers',
    ruleBarLeft: cfg.ruleBar?.left,
    ruleBarRight: cfg.ruleBar?.right,
    reviewsStore: cfg.reviewsStore,
    phone: cfg.phone,
    phoneHref: cfg.phoneHref,
    fcaReference: '741896',
    legalFooter: cfg.legalFooter ?? '',
    // Off by default — the site should present cleanly until compliance asks
    // to see the outstanding markers.
    showConfirmNotes: false,
  };
}

/**
 * Stubs for the pages the footer and nav link to. Real wording has to come
 * from the business — but an empty document that says so is better than a
 * dead link, and it puts the gap where the client will see it.
 */
function legalStubs() {
  const pages = [
    ['privacy', 'Privacy policy', 'How we collect, use and protect personal information.'],
    ['terms', 'Terms of business', 'The terms on which Trinity provides pawn loans.'],
    ['cookies', 'Cookie policy', 'What we store on your device, and why.'],
    ['complaints', 'Complaints procedure', 'How to complain, and what happens next.'],
    ['trust-and-security', 'Trust & security', 'How your item is valued, insured and stored.'],
  ];
  const today = new Date().toISOString().slice(0, 10);
  return pages.map(([slug, title, description]) => ({
    _id: `legalPage-${slug}`,
    _type: 'legalPage',
    title,
    slug: { _type: 'slug', current: slug },
    updatedAt: today,
    body: [
      {
        _key: 'placeholder',
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _key: 'placeholder0',
            _type: 'span',
            marks: [],
            text:
              'This page is awaiting its final wording. Replace this text in the Studio before the site goes live.',
          },
        ],
      },
    ],
    seo: {
      _type: 'seo',
      title,
      description,
      // Kept out of search until the real wording is in.
      noIndex: true,
    },
  }));
}

/* ---------- run ------------------------------------------------------- */

const dir = resolve(root, 'legacy/src/content');
const files = (await readdir(dir)).filter((f) => f.endsWith('.js')).sort();

// Gold first, then the rest alphabetically — matches the homepage order.
const preferred = ['gold', 'watches', 'jewellery', 'diamonds', 'fine-art', 'handbags', 'silver'];
const ordered = files.sort((a, b) => {
  const ai = preferred.indexOf(basename(a, '.js'));
  const bi = preferred.indexOf(basename(b, '.js'));
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
});

console.log(`\n  ${DRY ? 'Dry run' : 'Importing'} → project ${projectId}, dataset ${dataset}\n`);

const docs = [await buildSiteSettings(), ...legalStubs()];
for (const [i, file] of ordered.entries()) {
  const mod = await import(pathToFileURL(resolve(dir, file)).href);
  docs.push(await buildAssetPage(mod.default, i));
  console.log(`  · ${basename(file, '.js')}`);
}

if (DRY) {
  const sizes = docs.map((d) => `${d._id} (${JSON.stringify(d).length.toLocaleString()} bytes)`);
  console.log(`\n  Would write ${docs.length} documents:\n    ${sizes.join('\n    ')}`);
  const out = resolve(root, '.migration-preview.json');
  await writeFile(out, JSON.stringify(docs, null, 2));
  console.log(`\n  Full output written to .migration-preview.json for review.\n`);
  process.exit(0);
}

const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
await tx.commit();
console.log(`\n  Wrote ${docs.length} documents.\n`);
