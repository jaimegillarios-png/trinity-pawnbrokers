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
import { PRIVACY, TERMS, COMPLAINTS, COOKIES, TRUST } from './legal-content.mjs';
import { FAQ_GROUPS } from './faq-content.mjs';

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

/**
 * The content files were written to be interpolated straight into HTML, so
 * they carry entities. Sanity stores text, not markup — an `&amp;` reaching a
 * document renders as a literal "&amp;" on the page and, worse, shows up that
 * way in the Studio for the client to trip over. Every string the migration
 * writes goes through here (see decodeDeep at the bottom).
 */
const decode = (s = '') =>
  s.replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&hellip;/g, '…')
   .replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&middot;/g, '·')
   .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
   .replace(/&rarr;/g, '→').replace(/&larr;/g, '←')
   .replace(/&nbsp;/g, ' ').replace(/&pound;/g, '£').replace(/&times;/g, '×')
   .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
   // Last, so the entities above can't be resurrected by an &amp;-encoded one.
   .replace(/&amp;/g, '&');

const deMarkup = (html = '') =>
  decode(html)
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
    // schema.org format, because organisationSchema publishes these verbatim.
    // Source: unbolted.com/uk/contact-us — the same office and the same firm.
    openingHours: ['Mo-Th 09:00-17:30', 'Fr 09:00-17:00'],
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
/**
 * The About page. Every claim here is one the site already makes somewhere —
 * the 2013 start, the £10m figure, the Trinity/Unbolted split, the FCA
 * reference — restated at length rather than invented. Nothing about named
 * staff or premises history: the business has to supply that.
 */
async function buildAboutPage() {
  const card = (icon, title, body) => ({ _type: 'iconCard', icon, title, body });

  return {
    _id: 'aboutPage',
    _type: 'aboutPage',

    hero: {
      _type: 'heroSection',
      image: await uploadImage('images/hero/beat-2.jpeg', "A ring examined under a jeweller's loupe"),
      eyebrow: 'About the house',
      heading: 'The pawnbroker for the things you *intend to keep*.',
      intro:
        'Trinity exists for one situation: you own something valuable, you need the money it represents, and you have no intention of losing the thing itself. Everything here is arranged around giving it back.',
      ctaPrimary: { _type: 'cta', label: 'Value your item', href: '/#index' },
      ctaGhost: { _type: 'cta', label: 'How a pawn loan works', href: '/#how' },
    },

    record: keyed(
      [
        { _type: 'specRow', label: 'Established', value: '2013' },
        { _type: 'specRow', label: 'Authorised by', value: 'FCA · Ref 741896' },
        { _type: 'specRow', label: 'Trading as', value: 'Trinity · Unbolted' },
        { _type: 'specRow', label: 'Where', value: 'City of London' },
      ],
      'record',
    ),

    why: {
      intro: {
        eyebrow: 'Why Trinity exists',
        heading: 'The high street was never built for fine things.',
      },
      paragraphs: [
        'A branch pawnbroker prices to the floor. A gold chain is weighed, a watch is glanced at, and the offer is whatever would survive a quick sale — because a shop with a window on every high street has to assume the worst case, and carries the overheads either way.',
        'That is a perfectly good business. It is a poor one for a Patek, a signed Cartier piece, or a canvas with provenance — the items where the gap between scrap and market is most of the money.',
        'Trinity was set up to lend against that gap. A specialist in the actual category values the item for what it is, and the loan is funded by *Unbolted’s network of lenders* rather than a branch estate. That is the whole trick, and it is why more of your item’s value reaches you, at a lower rate than the names you have walked past.',
      ],
    },

    oneFirm: {
      eyebrow: 'Trinity · Unbolted',
      statement:
        '*Trinity Pawnbrokers* receives, values and safeguards your item. *Unbolted* funds the loan against it.',
      note:
        'One firm stands behind both: Open Access Finance Ltd, authorised and regulated by the Financial Conduct Authority under reference 741896. Trinity is the counter and the strongroom; Unbolted is the capital and the permission to lend. You deal with Trinity from the valuation to the moment your item comes home.',
      cta: { _type: 'cta', label: 'How your item is protected →', href: '/trust-and-security' },
      // Sourced rather than reused. Every photograph already in the repo is
      // one of the seven category product shots — each stored under three or
      // four paths (images/cards, images/hero, images/v2, images/v4), so the
      // "unused" files are the same gold, watch, silver, jewellery, handbag,
      // diamond and painting that are already on an item page and in the
      // homepage grid. A wall of brass deposit boxes is custody itself, and
      // its warmth sits with the gold palette rather than against it.
      // See images/about/CREDITS.md for the source and licence.
      image: await uploadImage('images/about/deposit-boxes.jpg', ''),
    },

    bench: {
      intro: {
        eyebrow: 'The bench',
        heading: 'Specialists, not a counter clerk',
        intro:
          'An item is only worth what somebody can recognise in it. Each category is valued by someone who works in that category, and the reasoning is shown on screen before you are asked for anything.',
      },
      disciplines: keyed(
        [
          card('ph-watch', 'Horology', 'References, movements, service history and the state of the bracelet — the things that move a watch valuation, and the things that do not.'),
          card('ph-diamond', 'Gemmology', 'Certificated or not, stones are assessed on the four Cs and on what the current market is actually paying for that cut and colour.'),
          card('ph-certificate', 'Hallmarks & silver', 'Maker, assay office and date letter first. Scrap weight is the floor of a silver valuation, never the whole of it.'),
          card('ph-paint-brush', 'Art & provenance', 'Attribution, condition and paper trail, read against recent auction results for the artist rather than a headline estimate.'),
          card('ph-handbag', 'Luxury leather goods', 'Date codes, hardware, stitching and the completeness of box and receipt — resale in this category turns on all four.'),
          card('ph-coins', 'Gold & bullion', 'Assayed and weighed in front of you, priced off the spot rate on the day, with the arithmetic shown.'),
        ],
        'bench',
      ),
    },

    principles: {
      intro: {
        eyebrow: 'What we hold ourselves to',
        heading: 'Four things that do not change',
      },
      items: keyed(
        [
          card('ph-magnifying-glass', 'You see the working', 'The valuation, the rate and the total repayable are on screen before you commit to anything. No offer arrives with the reasoning left out.'),
          card('ph-truck', 'Insured from your door to ours', 'Free Special Delivery on our label, insured in transit, and insured for the whole time your item is with us.'),
          card('ph-eye', 'Nothing on your credit file', 'Your item is the security, so there is no credit check and no footprint. Nobody is told, and nothing is recorded against your name.'),
          card('ph-vault', 'Returned as you left it', 'A six-month renewable term. Repay it and the same piece comes back in the same condition, insured on the way home.'),
        ],
        'principle',
      ),
    },

    closing: {
      _type: 'closingSection',
      eyebrow: 'Start where it suits you',
      heading: 'See what your item is worth as a loan',
      intro:
        'Every item page values your item before asking anything of you. No credit check, no obligation, and a confirmed offer within one business day.',
      cta: { _type: 'cta', label: 'Value your item', href: '/#index' },
      contactPrefix: 'Or speak to a specialist on',
      contactSuffix: 'weekdays, 9am to 5.30pm.',
    },

    seo: {
      _type: 'seo',
      title: 'About Trinity Pawnbrokers | The house behind the loan',
      description:
        'A City of London pawnbroker lending against fine things since 2013. Specialist valuations, insured custody, and one FCA-regulated firm behind every loan.',
      ogImage: await uploadImage('images/hero/beat-2.jpeg', "A ring examined under a jeweller's loupe"),
    },
  };
}

/**
 * Turns the markdown in legal-content.mjs into Portable Text. Deliberately
 * small: the legal copy only uses headings, paragraphs and lists, and a full
 * markdown parser would be a dependency to keep current for no gain. Anything
 * it does not recognise stays a paragraph rather than silently vanishing.
 */
function mdToBlocks(md, prefix) {
  const blocks = [];
  let n = 0;

  /** Splits "see the [FOS](https://…) page" into spans plus their markDefs. */
  const inline = (text, key) => {
    const children = [];
    const markDefs = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)/g;
    let at = 0;
    let m;
    let i = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > at) {
        children.push({ _key: `${key}s${i++}`, _type: 'span', marks: [], text: text.slice(at, m.index) });
      }
      const mark = `${key}l${markDefs.length}`;
      markDefs.push({ _key: mark, _type: 'link', href: m[2] });
      children.push({ _key: `${key}s${i++}`, _type: 'span', marks: [mark], text: m[1] });
      at = m.index + m[0].length;
    }
    if (at < text.length) {
      children.push({ _key: `${key}s${i++}`, _type: 'span', marks: [], text: text.slice(at) });
    }
    return { children, markDefs };
  };

  const push = (style, text, listItem) => {
    const key = `${prefix}${n++}`;
    const { children, markDefs } = inline(text, key);
    const block = { _key: key, _type: 'block', style, markDefs, children };
    if (listItem) { block.listItem = listItem; block.level = 1; }
    blocks.push(block);
  };

  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('### ')) push('h3', line.slice(4));
    else if (line.startsWith('## ')) push('h2', line.slice(3));
    else if (line.startsWith('- ')) push('normal', line.slice(2), 'bullet');
    else if (/^\d+\.\s/.test(line)) push('normal', line.replace(/^\d+\.\s/, ''), 'number');
    else push('normal', line);
  }
  return blocks;
}

/**
 * The legal pages. Privacy, terms and complaints are the policies Open Access
 * Finance Ltd already publishes as Unbolted — the same firm and the same FCA
 * permission, so they are the ones that govern a Trinity loan. Cookies has no
 * published source and stays an openly-marked placeholder.
 *
 * `review: true` keeps a page out of search. Everything here still needs
 * compliance sign-off; the three sourced pages are indexable because they are
 * already public policy, the cookie placeholder is not.
 */
/**
 * The FAQ page. Content comes from the pawn FAQ the same firm publishes as
 * Unbolted — see faq-content.mjs for the source and the caveats.
 */
function buildFaqPage() {
  return {
    _id: 'faqPage',
    _type: 'faqPage',
    intro: {
      // No eyebrow: "FAQs" over "Frequently asked questions" was the same
      // words twice, and the heading is short enough to carry the section
      // on its own.
      heading: 'FAQs',
      intro:
        'Grouped by where you are in the process. If your question is not here, call us — the answer is quicker than the form.',
    },
    contactCta: { _type: 'cta', label: 'Contact us', href: '/contact' },

    groups: keyed(
      FAQ_GROUPS.map((group) => ({
        _type: 'faqGroup',
        title: group.title,
        items: keyed(group.items.map((item) => ({ _type: 'faqItem', ...item })), 'q'),
      })),
      'faqgroup',
    ),
    closing: {
      _type: 'closingSection',
      eyebrow: 'Still not sure?',
      heading: 'Ask us before you send anything',
      intro:
        'No question is too small, and nothing you ask commits you to anything. A specialist would rather answer it now than have your item arrive packed badly.',
      cta: { _type: 'cta', label: 'Value your item', href: '/#index' },
      contactPrefix: 'Or speak to a specialist on',
      contactSuffix: 'weekdays, 9am to 5.30pm.',
    },
    seo: {
      _type: 'seo',
      title: 'Pawn loan FAQs | Trinity Pawnbrokers',
      description:
        'How much you can borrow, how quickly the money arrives, what a valuation reflects, how your item travels and where it is kept. Answered in full.',
    },
  };
}

/**
 * The contact page. Numbers, address, hours and the two-hour reply promise all
 * come from unbolted.com/uk/contact-us — same firm, same office, same desk.
 */
function buildContactPage(mapEmbedUrl) {
  const channel = (icon, label, value, href, note) => ({
    _type: 'contactChannel', icon, label, value, href, note,
  });

  return {
    _id: 'contactPage',
    _type: 'contactPage',
    intro: {
      heading: 'Contact us',
      intro:
        'A specialist answers the phone during office hours. Email gets a reply within two working hours. The office is by appointment, so the right person is in the building when you arrive.',
    },
    channels: keyed(
      [
        channel(
          'ph-phone',
          'Call',
          '020 3567 1300',
          'tel:+442035671300',
          'Monday to Thursday, 9am to 5.30pm. Friday, 9am to 5pm. Closed at weekends and on bank holidays.',
        ),
        channel(
          'ph-envelope-simple',
          'Email',
          'support@unbolted.com',
          'mailto:support@unbolted.com',
          'We reply within two hours on a working day. Send photographs if you have them — it saves a round trip.',
        ),
        channel(
          'ph-map-pin',
          'Visit',
          'Token House, 11–12 Token House Yard, London EC2R 7AS',
          undefined,
          'By appointment only. Call or email first and we will have a specialist in the category waiting for you.',
        ),
      ],
      'channel',
    ),
    elsewhere: keyed(
      [
        {
          _type: 'pointer',
          title: 'Want a valuation first?',
          body: 'Every item page values your item before asking anything of you. No credit check, no obligation.',
          cta: { _type: 'cta', label: 'Value your item', href: '/#index' },
        },
        {
          _type: 'pointer',
          title: 'Making a complaint?',
          body: 'There is a published procedure, with timescales and the route to the Financial Ombudsman Service.',
          cta: { _type: 'cta', label: 'Complaints procedure', href: '/complaints' },
        },
        {
          _type: 'pointer',
          title: 'Question about how it works?',
          body: 'Borrowing limits, valuation, insurance, postage and what happens at the end of a term.',
          cta: { _type: 'cta', label: 'Read the FAQs', href: '/faq' },
        },
      ],
      'pointer',
    ),
    visitIntro: {
      eyebrow: 'The office',
      heading: 'Token House, in the City',
      intro:
        'Two minutes from Bank. Ring the bell at Token House Yard — we will come down and meet you.',
    },
    mapEmbedUrl,
    seo: {
      _type: 'seo',
      title: 'Contact Trinity Pawnbrokers | Call, email or visit',
      description:
        'Call 020 3567 1300, email support@unbolted.com, or visit our City of London office by appointment. Office hours, address and how to reach us.',
    },
  };
}

/**
 * The hub the main nav points at. Deliberately not a second copy of the
 * homepage grid: the criteria are the thing the grid has no room for, and the
 * category list carries what each item page says it accepts.
 */
function buildLendPage() {
  const card = (icon, title, body) => ({ _type: 'iconCard', icon, title, body });

  return {
    _id: 'lendPage',
    _type: 'lendPage',
    intro: {
      eyebrow: 'What we lend against',
      heading: 'If it is valuable and insurable, we can usually lend against it',
      intro:
        'Seven categories have a page of their own because they are what people bring us most. They are not the limit. What matters is whether a specialist can authenticate it, an insurer will cover it, and there is a market that would buy it.',
    },
    criteria: {
      intro: {
        heading: 'What makes something lendable',
      },
      items: keyed(
        [
          card('ph-magnifying-glass', 'It can be authenticated', 'A specialist in the category has to be able to establish what it is — a reference, a hallmark, a certificate, a provenance trail. Anything that cannot be verified cannot be valued.'),
          card('ph-shield-check', 'It can be insured', 'Cover runs from the moment your item leaves you until the moment it comes back. If an underwriter will not cover it in transit and storage, we will not take it in.'),
          card('ph-chart-line-up', 'It has a resale market', 'A valuation is an estimate of what the item would realise on the secondary market today. Rarity alone is not value; there has to be somebody who buys these.'),
          card('ph-package', 'It can be moved and held safely', 'Most things travel by insured courier. Larger or more fragile items go by specialist logistics. Anything that cannot be safely moved or stored is a conversation, not a no.'),
        ],
        'criterion',
      ),
    },
    indexIntro: {
      eyebrow: 'The seven',
      heading: 'Categories with a page of their own',
      intro:
        'Each one values your item on the page, before asking anything of you. What each page accepts is listed underneath it.',
    },
    other: {
      title: 'Something else?',
      body:
        'Classic cars, fine wine, musical instruments, watches nobody has heard of, a single lot from a collection. If it meets the four tests above, tell us what it is and we will tell you honestly whether we can lend against it.',
      cta: { _type: 'cta', label: 'Ask us about your item', href: '/contact' },
    },
    closing: {
      _type: 'closingSection',
      eyebrow: 'No obligation',
      heading: 'See what yours is worth as a loan',
      intro:
        'Pick the closest category and the page will value your item before it asks you for anything. No credit check, and a confirmed offer within one business day.',
      cta: { _type: 'cta', label: 'Value your item', href: '/#index' },
      contactPrefix: 'Or speak to a specialist on',
      contactSuffix: 'weekdays, 9am to 5.30pm.',
    },
    seo: {
      _type: 'seo',
      title: 'What we lend against | Trinity Pawnbrokers',
      description:
        'Gold, watches, jewellery, diamonds, fine art, handbags and silver — and what else qualifies. The four tests an item has to pass before we can lend against it.',
    },
  };
}

const TODAY = new Date().toISOString().slice(0, 10);

function legalPages() {
  const pages = [
    {
      slug: 'privacy',
      title: 'Privacy policy',
      description:
        'How Open Access Finance Ltd collects, uses and protects your personal information.',
      updatedAt: '2018-05-17',
      body: PRIVACY,
    },
    {
      slug: 'terms',
      title: 'Terms of business',
      description: 'The terms on which this website is made available to you.',
      updatedAt: '2018-05-17',
      body: TERMS,
    },
    {
      slug: 'complaints',
      title: 'Complaints procedure',
      description:
        'How to complain, what happens next, and how to refer a complaint to the Financial Ombudsman Service.',
      updatedAt: '2018-05-17',
      body: COMPLAINTS,
    },
    {
      slug: 'cookies',
      title: 'Cookie policy',
      description: 'What we store on your device, and why.',
      updatedAt: TODAY,
      body: COOKIES,
      noIndex: true,
    },
    {
      slug: 'trust-and-security',
      title: 'Trust & security',
      description:
        'How your item travels to us, what it is insured for, where it is kept, and how it comes back.',
      updatedAt: TODAY,
      body: TRUST,
      noIndex: true,
    },
  ];

  return pages.map((page) => ({
    _id: `legalPage-${page.slug}`,
    _type: 'legalPage',
    title: page.title,
    slug: { _type: 'slug', current: page.slug },
    updatedAt: page.updatedAt,
    body: mdToBlocks(page.body, `${page.slug}-`),
    seo: {
      _type: 'seo',
      title: page.title,
      description: page.description,
      ...(page.noIndex ? { noIndex: true } : {}),
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

/**
 * Walks a built document and decodes every string in it. The per-field helpers
 * above already do this, but they are easy to bypass — a field copied straight
 * out of a content file (`label: f.label`) never touches them. This is the
 * backstop, and it is why no entity can reach the CMS by being forgotten.
 */
const decodeDeep = (value) => {
  if (typeof value === 'string') return decode(value);
  if (Array.isArray(value)) return value.map(decodeDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decodeDeep(v)]));
  }
  return value;
};

// The homepage is built first so the contact page can borrow its map embed
// rather than carrying a second copy of the same URL.
const home = await buildHomePage();

const docs = [
  await buildSiteSettings(),
  home,
  await buildAboutPage(),
  buildFaqPage(),
  buildContactPage(home.visit?.mapEmbedUrl),
  buildLendPage(),
  ...(await blogSeed()),
  ...legalPages(),
];
for (const [i, file] of ordered.entries()) {
  const mod = await import(pathToFileURL(resolve(dir, file)).href);
  docs.push(await buildAssetPage(mod.default, i));
  console.log(`  · ${basename(file, '.js')}`);
}

// Nothing goes to Sanity, or to the dry-run preview, carrying markup entities.
const decoded = docs.map(decodeDeep);

if (DRY) {
  const sizes = decoded.map((d) => `${d._id} (${JSON.stringify(d).length.toLocaleString()} bytes)`);
  console.log(`\n  Would write ${decoded.length} documents:\n    ${sizes.join('\n    ')}`);
  const out = resolve(root, '.migration-preview.json');
  await writeFile(out, JSON.stringify(decoded, null, 2));
  console.log(`\n  Full output written to .migration-preview.json for review.\n`);
  process.exit(0);
}

const tx = decoded.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
await tx.commit();
console.log(`\n  Wrote ${decoded.length} documents.\n`);
