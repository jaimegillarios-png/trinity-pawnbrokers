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
  s
    ? { eyebrow: deMarkup(s.eyebrow), heading: deMarkup(s.heading), intro: deMarkup(s.intro) }
    : undefined;

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
/**
 * Some compliance markers were written inline, inside card titles, FAQ answers
 * and labels. They come out into a field of their own — the marker survives,
 * and the copy stays plain text.
 */
const CHIP_RE = /\s*<span class="confirm-chip">([^<]*)<\/span>/;
const takeChip = (s = '') => {
  const m = s.match(CHIP_RE);
  return { text: s.replace(CHIP_RE, ''), chip: m ? m[1].trim() : undefined };
};

/** Applies takeChip across an object's text fields, hoisting the first chip. */
const liftChip = (obj, fields) => {
  let chip;
  const out = { ...obj };
  for (const f of fields) {
    if (typeof out[f] !== 'string') continue;
    const taken = takeChip(out[f]);
    out[f] = taken.text;
    if (taken.chip && !chip) chip = taken.chip;
  }
  return chip ? { ...out, chip } : out;
};

const deMarkup = (html = '') =>
  html
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '*$1*')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/* ---------- build documents ------------------------------------------ */

/**
 * The short line under each item on the homepage grid. It was written into
 * the homepage markup, not the content files, so it is read back from there.
 */
let cardImages = null;
/**
 * The homepage grid uses its own photograph per item, not the item page's
 * hero. They were base64 in the markup and are extracted to images/cards.
 */
async function cardImageFor(slug) {
  if (!cardImages) {
    cardImages = new Map();
    try {
      const manifest = JSON.parse(await readFile(resolve(root, 'images/cards/index.json'), 'utf8'));
      for (const card of manifest) cardImages.set(card.slug, card);
    } catch {
      console.warn('  ! no card image manifest; falling back to the hero image');
    }
  }
  const card = cardImages.get(slug);
  return card ? uploadImage(`images/cards/${card.name}`, card.alt) : undefined;
}

let cardTeasers = null;
async function teaserFor(slug) {
  if (!cardTeasers) {
    cardTeasers = new Map();
    const html = await readFile(resolve(root, 'legacy/index.html'), 'utf8');
    for (const m of html.matchAll(
      /<a href="([a-z-]+)\.html" class="ix-card"[\s\S]*?font-size:14\.5px[^"]*">([\s\S]*?)<\/span>/g,
    )) {
      cardTeasers.set(m[1], m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
    }
  }
  return cardTeasers.get(slug);
}

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
    cardImage: (await cardImageFor(content.slug)) ?? heroImage,
    cardTeaser: await teaserFor(content.slug),
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
      (content.trust ?? []).map((t) => ({ _type: 'trustItem', text: t.text, chip: t.chip, highlight: Boolean(t.highlight) })),
      'trust',
    ),
    lendAgainst: {
      intro: intro(content.lendAgainst),
      cards: keyed((content.lendAgainst?.cards ?? []).map((c) => liftChip({ _type: 'iconCard', ...c }, ['title', 'body'])), 'la'),
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
      steps: keyed((content.how?.steps ?? []).map((s) => liftChip({ _type: 'iconCard', ...s }, ['title', 'body'])), 'how'),
      link: content.how?.link ? { _type: 'cta', ...content.how.link } : undefined,
    },
    valuation: {
      intro: intro(content.valuation),
      points: keyed((content.valuation?.points ?? []).map((p) => liftChip({ _type: 'iconCard', ...p }, ['title', 'body'])), 'val'),
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
            label: takeChip(content.proof.caseStudy.label).text.trim(),
            chip: takeChip(content.proof.caseStudy.label).chip,
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
      items: keyed((content.faqs?.items ?? []).map((f) => liftChip({ _type: 'faqItem', ...f }, ['q', 'a'])), 'faq'),
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
  if (!cfg.legal && !cfg.legalFooter) {
    fail('No legal footer found in trinity.config.mjs — refusing to write an empty regulatory footer.');
  }

  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: cfg.name ?? 'Trinity Pawnbrokers',
    ruleBarLeft: cfg.ruleBar?.left,
    ruleBarRight: cfg.ruleBar?.right,
    reviewsStore: cfg.reviewsStore,
    phone: cfg.phone,
    phoneHref: cfg.phoneHref,
    // The published London office. It lives here rather than only inside the
    // homepage "Visit us" copy because the footer and the FinancialService
    // JSON-LD both need it structured, not as a sentence.
    address: {
      street: 'Token House, 11–12 Token House Yard',
      locality: 'London',
      postcode: 'EC2R 7AS',
      country: 'GB',
    },
    fcaReference: '741896',
    legalFooter: (cfg.legal ?? cfg.legalFooter ?? '')
      .replace(/&amp;/g, '&').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
      .replace(/&rsquo;/g, '’').replace(/&middot;/g, '·'),
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


/**
 * The homepage, recovered from legacy/index.html. Its copy was written into
 * the markup, so it is read back out section by section rather than retyped.
 */
async function buildHomePage() {
  const html = await readFile(resolve(root, 'legacy/index.html'), 'utf8');
  // Entities and <br> have to survive the trip: the CMS holds plain text, so
  // an undecoded &ndash; ends up rendered literally on the page.
  const decode = (s = '') =>
    s.replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&hellip;/g, '…')
     .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&middot;/g, '·')
     .replace(/&rarr;/g, '→').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

  const clean = (s = '') =>
    decode(s.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''))
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim();

  /** Keeps the gold spans as *asterisks*, which the template renders back. */
  const cleanEmphasis = (s = '') =>
    clean(s.replace(/<span[^>]*gold-mid[^>]*>([\s\S]*?)<\/span>/g, '*$1*'));
  const between = (from, to) => {
    const a = html.indexOf(from);
    const b = to ? html.indexOf(to, a) : html.length;
    return a === -1 ? '' : html.slice(a, b);
  };

  const hero = between('<!-- ===== HERO', '<!-- ===== ASSET COLLAGE');
  const collage = between('<!-- ===== ASSET COLLAGE', '<!-- ===== HOW IT WORKS');
  const how = between('<!-- ===== HOW IT WORKS', '<!-- ===== CUSTODY');
  const custody = between('<!-- ===== CUSTODY', '<!-- ===== PROOF');
  const rates = between('<!-- ===== PROOF', '<!-- ===== VISIT');
  const visit = between('<!-- ===== VISIT', '<!-- ===== AS SEEN');
  const press = between('<!-- ===== AS SEEN', '<!-- ===== FOOTER');

  const pressLogos = [];
  try {
    const manifest = JSON.parse(await readFile(resolve(root, 'images/press/index.json'), 'utf8'));
    for (const [i, logo] of manifest.entries()) {
      const img = await uploadImage(`images/press/${logo.name}`, logo.alt);
      if (img) pressLogos.push({ _key: `logo${i}`, ...img, height: logo.height });
    }
  } catch {
    console.warn('  ! no press logo manifest, skipping');
  }

  // The hero frames were embedded as base64 in the markup. They are extracted
  // to images/hero rather than guessed at from the image folder — the poster
  // frame in particular is a specific photograph, not any street scene.
  const heroFrames = JSON.parse(await readFile(resolve(root, 'images/hero/index.json'), 'utf8'));
  const heroImage = await uploadImage(`images/hero/${heroFrames[0].name}`, heroFrames[0].alt);
  const rotation = [];
  for (const frame of heroFrames.slice(1)) {
    const img = await uploadImage(`images/hero/${frame.name}`, frame.alt);
    if (img) rotation.push({ _key: 'beat' + rotation.length, ...img });
  }

  const heroH1 = clean((hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]);
  const heroEm = clean((hero.match(/<em[^>]*>([\s\S]*?)<\/em>/) || [])[1]);
  const heroIntro = clean((hero.match(/<p style="max-width:52ch[^>]*>([\s\S]*?)<\/p>/) || [])[1]);
  const heroCtas = [...hero.matchAll(/<a href="([^"]+)" class="cta-(gold|ghost)"[^>]*>([^<]+)<\/a>/g)];

  const trust = [...hero.matchAll(/<span style="white-space:nowrap([^"]*)">([\s\S]*?)<\/span>/g)].map((m, i) => ({
    _key: 'trust' + i,
    _type: 'trustItem',
    text: clean(m[2]),
    highlight: m[1].includes('gold-bright'),
  }));

  const steps = [...how.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>/g)].map((m, i) => ({
    _key: 'step' + i,
    _type: 'iconCard',
    title: clean(m[1]),
    body: clean(m[2]),
  }));

  // The figure's own style decides whether it is set in gold. Testing the whole
  // match caught the label, which is always gold, and made every figure gold.
  const stats = [...rates.matchAll(
    /<div style="font:500 12\.5px[^"]*">([\s\S]*?)<\/div>\s*<div style="(font:500 32px[^"]*)">([\s\S]*?)<\/div>\s*<p[^>]*>([\s\S]*?)<\/p>/g,
  )].map((m, i) => ({
    _key: 'stat' + i,
    _type: 'rateStat',
    label: clean(m[1]),
    figure: clean(m[3]),
    note: clean(m[4]),
    gold: m[2].includes('gold-deep'),
  }));

  const visitBlocks = [...visit.matchAll(
    /<div style="font:500 12\.5px[^"]*">([\s\S]*?)<\/div>\s*<p style="font:500 22px[^"]*">([\s\S]*?)<\/p>/g,
  )].map((m, i) => ({ _key: 'visit' + i, _type: 'specRow', label: clean(m[1]), value: clean(m[2]) }));

  return {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      _type: 'heroSection',
      image: heroImage,
      eyebrow: 'Pawn loans against\ngold · watches · jewellery · diamonds · fine art',
      // The italic phrase was an <em>; asterisks carry that intent as plain text.
      heading: heroEm ? heroH1.replace(heroEm, '*' + heroEm + '*') : heroH1,
      intro: heroIntro,
      ctaPrimary: heroCtas[0]
        ? { _type: 'cta', label: clean(heroCtas[0][3]), href: heroCtas[0][1] }
        : { _type: 'cta', label: 'Value your item', href: '#index' },
      ctaGhost: heroCtas[1] ? { _type: 'cta', label: clean(heroCtas[1][3]), href: heroCtas[1][1] } : undefined,
    },
    heroRotation: rotation,
    trust,
    indexIntro: {
      eyebrow: clean((collage.match(/<div style="font:500 13px[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
      heading: clean((collage.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]),
      intro: clean((collage.match(/<p style="max-width:64ch[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
    },
    indexOther: {
      eyebrow: clean((collage.match(/letter-spacing:0\.24em[^"]*">([\s\S]*?)<\/span>/) || [])[1]),
      title: clean((collage.match(/text-wrap:pretty;color:var\(--tr-neutral\)">([\s\S]*?)<\/span>/) || [])[1]),
      body: clean((collage.match(/color:var\(--tr-on-green\)">([\s\S]*?)<\/span>/) || [])[1]),
      cta: { _type: 'cta', label: 'Speak to us →', href: '/contact' },
    },
    how: {
      intro: {
        eyebrow: clean((how.match(/<div style="font:500 13px[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
        heading: clean((how.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]),
        intro: clean((how.match(/<p style="color:var\(--tr-ink-72\)[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
      },
      steps,
    },
    custody: {
      eyebrow: clean((custody.match(/letter-spacing:0\.28em[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
      statement: cleanEmphasis((custody.match(/<p style="font:500 clamp\(24px[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
      note: clean((custody.match(/max-width:54ch[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
      cta: {
        _type: 'cta',
        label: clean((custody.match(/class="custody-link"[^>]*>([\s\S]*?)<\/a>/) || [])[1]) || 'How your item is protected →',
        href: (custody.match(/class="custody-link"[^>]*href="([^"]*)"/) || [])[1]
          || (custody.match(/href="([^"]*)"[^>]*class="custody-link"/) || [])[1]
          || '/how-it-works',
      },
    },
    rates: {
      intro: {
        eyebrow: clean((rates.match(/<div style="font:500 13px[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
        heading: clean((rates.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]),
        intro: clean((rates.match(/<p style="color:var\(--tr-ink-72\)[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
      },
      stats,
      footnote: clean((rates.match(/padding:18px 22px[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
    },
    visit: {
      intro: {
        eyebrow: clean((visit.match(/<div style="font:500 13px[^"]*">([\s\S]*?)<\/div>/) || [])[1]),
        heading: clean((visit.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]),
        intro: clean((visit.match(/<p style="color:var\(--tr-ink-72\)[^"]*">([\s\S]*?)<\/p>/) || [])[1]),
      },
      blocks: visitBlocks,
      cta: { _type: 'cta', label: 'Get directions →', href: '#' },
      mapEmbedUrl: (visit.match(/<iframe[^>]*src="([^"]+)"/) || [])[1],
    },
    press: {
      label: 'As seen in',
      // The logos were base64 in the markup; scripts/extract-press-logos wrote
      // them to images/press. Each keeps its own display height, because they
      // are optically balanced rather than uniform.
      logos: pressLogos,
    },
    seo: {
      _type: 'seo',
      title: clean((html.match(/<title>([^<]*)<\/title>/) || [])[1]),
      description: clean((html.match(/<meta name="description" content="([^"]*)"/) || [])[1]),
    },
  };
}

/**
 * The blog has no content and no equivalent on the old site, so this seeds the
 * index and five placeholder articles — enough to judge the layout, including
 * the featured slot. Every one is noindex, and every one opens by saying what
 * it is. They are meant to be replaced or deleted before launch.
 */
async function blogSeed() {
  const para = (key, text, style = 'normal') => ({
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: key + 's', _type: 'span', marks: [], text }],
  });

  const PLACEHOLDER =
    'Placeholder article. The layout is real; the words are not. Replace this with real writing, or delete the article, before the site goes live.';

  const drafts = [
    {
      slug: 'what-a-watch-specialist-looks-at',
      title: 'What a watch specialist actually looks at',
      excerpt:
        'Reference numbers, service history, the state of the bracelet — the things that move a valuation, and the things that do not.',
      image: 'watches',
      related: 'watches',
      featured: true,
      date: '2026-08-14T09:00:00.000Z',
    },
    {
      slug: 'why-a-hallmark-matters-more-than-weight',
      title: 'Why a hallmark matters more than the weight',
      excerpt:
        'Scrap value is the floor, not the price. What the marks on a piece of silver tell a specialist about what it is worth.',
      image: 'silver',
      related: 'silver',
      date: '2026-08-07T09:00:00.000Z',
    },
    {
      slug: 'certificated-or-not',
      title: 'Certificated or not: what changes when you borrow against a diamond',
      excerpt:
        'A GIA report makes a valuation faster and firmer. It is not a requirement, and an uncertificated stone is not a lesser one.',
      image: 'diamonds',
      related: 'diamonds',
      date: '2026-07-31T09:00:00.000Z',
    },
    {
      slug: 'what-happens-while-we-hold-it',
      title: 'What happens to your item while we hold it',
      excerpt:
        'Insured door to door, held in the City, never displayed and never sold while the loan is running. What custody actually means.',
      image: 'jewellery',
      related: 'jewellery',
      date: '2026-07-24T09:00:00.000Z',
    },
    {
      slug: 'redeeming-early',
      title: 'Redeeming early, and what it saves you',
      excerpt:
        'Interest is charged for the time the loan runs. Repay in month two of a six-month term and you pay for two months.',
      image: 'gold',
      related: 'gold',
      date: '2026-07-17T09:00:00.000Z',
    },
  ];

  const covers = JSON.parse(await readFile(resolve(root, 'images/cards/index.json'), 'utf8'));
  const coverFor = async (slug) => {
    const card = covers.find((c) => c.slug === slug);
    return card ? uploadImage(`images/cards/${card.name}`, card.alt) : undefined;
  };

  const posts = [];
  for (const draft of drafts) {
    posts.push({
      _id: `post-${draft.slug}`,
      _type: 'post',
      title: draft.title,
      slug: { _type: 'slug', current: draft.slug },
      publishedAt: draft.date,
      featured: Boolean(draft.featured),
      excerpt: draft.excerpt,
      coverImage: await coverFor(draft.image),
      relatedAssets: [{ _key: 'rel0', _type: 'reference', _ref: `assetPage-${draft.related}` }],
      body: [
        para('p1', PLACEHOLDER),
        para('h1', 'A sub-heading looks like this', 'h2'),
        para('p2', 'Body copy sits at a comfortable measure, in the same type and colour as the rest of the site. Links, lists, quotes and images are all available to whoever is writing.'),
        para('p3', 'Related item pages appear at the end. That is how the blog earns its keep for search: an article answers a question someone asks before they pawn something, then points at the page that serves them.'),
      ],
      seo: {
        _type: 'seo',
        title: draft.title,
        description: draft.excerpt,
        // Placeholder copy must never be indexable.
        noIndex: true,
      },
    });
  }

  return [
    {
      _id: 'blogIndex',
      _type: 'blogIndex',
      eyebrow: 'The blog',
      title: 'Notes on lending against fine things',
      standfirst:
        'What we look for, what determines a valuation, and how to look after the things you own.',
      seo: {
        _type: 'seo',
        title: 'Blog — Trinity Pawnbrokers',
        description:
          'Notes on pawnbroking, valuation and looking after what you own, from the specialists at Trinity Pawnbrokers.',
      },
    },
    ...posts,
  ];
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

const docs = [await buildSiteSettings(), await buildHomePage(), ...(await blogSeed()), ...legalStubs()];
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
