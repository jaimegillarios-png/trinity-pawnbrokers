#!/usr/bin/env node
/**
 * Adds three item pages — Classic cars, Wine, Musical instruments — to Sanity.
 *
 *   node scripts/add-item-pages.mjs --dry-run
 *   node scripts/add-item-pages.mjs
 *
 * Needs SANITY_API_WRITE_TOKEN in .env.
 *
 * FIRST-DRAFT COPY, written by the build team on 22 Sep 2026 because the
 * client's copy had not arrived. It follows the structure and voice of the
 * seven existing item pages, but it has NOT been reviewed by Stephano or by
 * compliance. Every figure that is not already established site-wide is in
 * [square brackets], and every operational claim specific to these items
 * (vehicle storage, wine in bond, instrument climate control) carries a
 * review chip. Replace with the client's copy when it arrives.
 *
 * The shared parts — the second form step, the representative example, the
 * reviews line — are copied from the silver page, so the three new pages
 * cannot drift from the seven on anything regulated.
 *
 * Images: images/items/, placeholders from Unsplash (see CREDITS.md there).
 * createOrReplace: re-running reverts Studio edits to these three pages.
 */
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');

const env = Object.fromEntries(
  (await readFile(resolve(root, '.env'), 'utf8'))
    .split('\n').map((l) => l.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].trim()]),
);
const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/* ---------- helpers ---------- */

const keyed = (items, prefix) => items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));
const card = (icon, title, body) => ({ _type: 'iconCard', icon, title, body });
const row = (label, highStreet, trinity, icon, trinityChip) =>
  ({ _type: 'compareRow', label, highStreet, trinity, icon, ...(trinityChip ? { trinityChip } : {}) });
const faq = (q, a, chip) => ({ _type: 'faqItem', q, a, ...(chip ? { chip } : {}) });
const field = (id, label, type, extra = {}) => ({ _type: 'formField', id, label, type, ...extra });
const formRows = (rows, prefix) =>
  rows.map((fields, r) => ({ _key: `${prefix}r${r}`, _type: 'formRow', fields: fields.map((f, i) => ({ _key: `${prefix}r${r}f${i}`, ...f })) }));

const uploads = new Map();
async function image(relPath, alt) {
  const buffer = await readFile(resolve(root, relPath));
  const hash = createHash('sha1').update(buffer).digest('hex');
  if (!uploads.has(hash)) {
    uploads.set(hash, DRY
      ? `image-DRYRUN-${hash.slice(0, 8)}`
      : (await client.assets.upload('image', buffer, { filename: basename(relPath) }))._id);
  }
  return { _type: 'image', alt, asset: { _type: 'reference', _ref: uploads.get(hash) } };
}

/* ---------- shared with the seven existing pages ---------- */

const silver = await client.fetch('*[_id == "assetPage-silver"][0]{ form, repExample, proof }');
if (!silver) throw new Error('assetPage-silver not found — it is the template for the shared parts');

const COMMON_FAQ = {
  sell: (noun, back) => faq(`Do I have to sell my ${noun}?`, `No. This is a loan against it. You keep ownership throughout and take ${back} back when you repay.`),
  cannotRepay: (it) => faq('What if I cannot repay?', `Talk to us. Loans can usually be extended. If a loan is not repaid, ${it} may be sold, and anything it makes above what you owe comes back to you.`),
  credit: faq('Will this affect my credit file?', 'No. There is no credit check and nothing is recorded.'),
};

const CREDIT_ROW = row('Credit file', 'May run credit checks', 'No credit checks, and nothing recorded on your credit file', 'ph-identification-card');
const RATES_ROW = row('Rates', 'Higher headline APRs', 'Lower rates than typical high-street pawnbroking', 'ph-percent', 'Needs substantiated APR');

const specs = (termChip) => keyed([
  { _type: 'specRow', label: 'Loan size', value: '£500 upwards' },
  { _type: 'specRow', label: 'Term', value: '6 months, renewable', ...(termChip ? { chip: termChip } : {}) },
  { _type: 'specRow', label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
  { _type: 'specRow', label: 'Credit file', value: 'No credit checks' },
], 'spec');

const example = (statement, note) => ({
  _type: 'workedExample',
  label: 'Worked example',
  chip: 'Rate-led example awaiting compliance',
  statement,
  note,
  rows: keyed([
    { _type: 'ledgerRow', label: 'Amount borrowed', value: '£[X,XXX]' },
    { _type: 'ledgerRow', label: 'Term', value: '[X] months' },
    { _type: 'ledgerRow', label: 'Interest', value: '£[XXX]' },
    { _type: 'ledgerRow', label: 'Total to repay', value: '£[X,XXX]' },
    { _type: 'ledgerRow', label: 'Representative APR', value: '[XX.X]%', total: true },
  ], 'ex'),
});

const caseStudy = (noun) => ({
  ...silver.proof.caseStudy,
  statement: `[${noun} case study to be supplied — the item, the sum lent, the timeline, redeemed. No identifiable people, no full customer names.]`,
});

const trust = (second, fifth) => keyed([
  { _type: 'trustItem', text: '£60m+ lent since 2013', chip: 'Confirm', highlight: false },
  { _type: 'trustItem', text: second, highlight: false },
  { _type: 'trustItem', text: 'Funds within 24 hours', highlight: false },
  { _type: 'trustItem', text: 'FCA regulated, ref 741896', highlight: false },
  { _type: 'trustItem', text: fifth, highlight: true },
], 'trust');

const form = ({ heading, intro, backLabel, photosHint, stepOneRows, prefix }) => ({
  ...silver.form,
  heading,
  intro,
  backLabel,
  photosHint,
  stepOneRows: formRows(stepOneRows, `${prefix}1`),
  noteStep2: silver.form.noteStep2.replace(/your silver/g, prefix === 'car' ? 'your car' : prefix === 'wine' ? 'your wine' : 'your instrument'),
});

const closing = (label, heading) => ({
  _type: 'closingSection',
  eyebrow: 'Get started',
  heading,
  intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
  cta: { _type: 'cta', label, href: '#value-form' },
  contactPrefix: 'Or speak to a specialist:',
  contactSuffix: '· WhatsApp',
});

const DRAFT = 'first-draft copy by the build team, NOT yet reviewed by the client · figures pending compliance';

/* ---------- the three pages ---------- */

const pages = [
  /* ------------------------------ CLASSIC CARS ------------------------------ */
  {
    slug: 'classic-cars',
    order: 7,
    title: 'Classic cars',
    nounSingular: 'car',
    nounPlural: 'classic cars',
    card: ['images/items/classic-cars-card.jpg', 'A classic roadster in a dark garage'],
    heroImg: ['images/items/classic-cars-hero.jpg', 'A 1960s roadster in low light'],
    cardTeaser: 'Classic and collectable cars — kept in secure storage, not on a logbook.',
    hero: {
      eyebrow: 'Pawn loans against classic cars · City of London · Est. 2013',
      heading: 'Borrow against your *classic car*. Drive it home when you repay.',
      intro: 'Trinity makes pawn loans against classic and collectable cars — post-war sports cars, grand tourers and modern classics — from £500 with no maximum. Valued by specialists on marque, history and condition, collected by covered transport, kept in secure, insured storage, and returned to you exactly as you left it when you repay.',
      ctaLabel: 'Value my car',
    },
    trust: ['Valued on history & condition', 'Covered, insured transport'],
    lendAgainst: {
      heading: 'The cars we lend against',
      intro: 'We lend against cars with an established collector market — the ones that hold or grow their value. Service history, the V5C and restoration records help; a car does not need to be concours to qualify.',
      cards: [
        card('ph-car-profile', 'Post-war sports & GT cars', 'Jaguar, Aston Martin, Porsche, Ferrari, Mercedes-Benz and the marques that set the market.'),
        card('ph-steering-wheel', 'Modern classics', 'Limited-run and collectable cars from the 1980s onwards, valued on originality and mileage.'),
        card('ph-hourglass', 'Pre-war & vintage cars', 'Assessed on provenance, originality and the depth of the market for the model.'),
        card('ph-flag-checkered', 'Competition & historic cars', 'Cars with a racing history or a notable ownership, where the record is part of the value.'),
      ],
    },
    valuation: {
      heading: 'Valued on the car, and on its history',
      intro: 'Every car is assessed by a specialist — the marque and model, matching numbers, originality, condition and the paperwork behind it — then valued against recent auction and private-sale results for comparable cars. A documented history is worth money, and we value it as such.',
      points: [
        card('ph-magnifying-glass', 'Inspected in person', 'Bodywork, mechanicals and originality checked before an offer is confirmed.'),
        card('ph-clipboard-text', 'History read, not skimmed', 'Service records, restoration invoices and ownership all count.'),
        card('ph-chart-line-up', 'Priced against the market', 'Recent auction and dealer results for the same model.'),
        card('ph-eye', 'Nothing sight-unseen', 'You see the valuation before you commit to anything.'),
      ],
    },
    borrow: {
      heading: 'Valued for the car, not a trade-in',
      intro: 'Your car is valued by a specialist against the current collector market for the model — not a trade-in price or a guide book figure. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
      example: example(
        'Borrow £[X,XXX] against a classic sports car for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
        'Indicative only. Your offer depends on the specific car, its history and condition, and the market on the day.',
      ),
    },
    why: {
      heading: 'A pawnbroker for the car you intend to *keep*.',
      intro: 'A logbook loan leaves the car on your drive and a bill of sale over it; a dealer buys it outright. We do neither. A pawn loan is a loan: the car is held safely until you repay, you keep ownership throughout, and it comes back to you. That difference is the whole business.',
      rows: [
        row('Your car', 'Sold to a dealer, or a bill of sale over it', 'Yours throughout — a loan, never a sale', 'ph-car-profile'),
        RATES_ROW,
        row('Valuation', 'A trade-in or guide-book price', 'Valued by specialists against the collector market', 'ph-scales'),
        row('Storage', 'Left on the street, or on your drive under a bill of sale', 'Secure, insured, covered storage', 'ph-garage', 'Storage arrangement to confirm'),
        CREDIT_ROW,
        row('Transport', 'Your problem', 'Covered, insured transport arranged for you', 'ph-truck', 'Transport arrangement to confirm'),
      ],
    },
    how: {
      heading: 'Four steps. Your car back at the end.',
      steps: [
        card('ph-chat-teardrop-text', 'Tell us about your car', 'Send the make, model, year, mileage and a few photos. A specialist values it and sends an indicative offer the same day.'),
        card('ph-truck', 'We collect it, insured', 'We arrange covered, insured transport from your home or garage, or a specialist can inspect the car where it is. It is insured from the moment it leaves you.'),
        card('ph-hand-coins', 'Accept the offer and get paid', 'Once we’ve inspected the car in person we confirm the valuation. Accept, and the money is with you within 24 hours.'),
        card('ph-steering-wheel', 'Repay, and it’s back with you', 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your car is returned exactly as you left it.'),
      ],
    },
    faqs: [
      COMMON_FAQ.sell('car', 'it'),
      faq('Is this a logbook loan?', 'No. A logbook loan lets you keep driving the car while the lender holds a bill of sale over it. With a pawn loan we hold the car itself, safely, until you repay — so there is nothing registered against a car on your drive.'),
      faq('Will the car be driven while you have it?', 'No, beyond what is needed to move it in and out of storage. It is kept covered, insured and unused, and returned exactly as you left it.', 'Storage conditions and mileage policy to confirm'),
      faq('Do I need the V5C and service history?', 'The V5C, yes — it shows the car is yours to borrow against. Service history and restoration records aren’t essential, but they support the valuation.'),
      faq('How does the car get to you?', 'By covered, insured transport that we arrange, from your home or garage. A specialist can also inspect the car where it is before it moves.', 'Transport and insurance arrangement to confirm'),
      COMMON_FAQ.cannotRepay('the car'),
      COMMON_FAQ.credit,
    ],
    form: {
      prefix: 'car',
      heading: 'What is your car worth as a loan?',
      intro: 'Tell us the make, model and year, what history comes with it, and send a few photos. A specialist reviews the car against the current collector market and comes back with an indicative offer the same day, at no cost and with no obligation.',
      backLabel: '← Back to your car',
      photosHint: 'The car from each side, the interior, the engine bay and the odometer',
      stepOneRows: [
        [field('wf-make', 'Make', 'text', { optional: false, placeholder: 'e.g. Jaguar, Aston Martin, Porsche' }), field('wf-model', 'Model', 'text', { optional: true, placeholder: 'e.g. E-Type Series 1' })],
        [field('wf-year', 'Year', 'text', { optional: true, placeholder: 'e.g. 1966' }), field('wf-mileage', 'Mileage', 'text', { optional: true })],
        [field('wf-condition', 'Condition', 'select', { optional: true, options: ['Concours', 'Excellent', 'Good', 'Usable driver', 'Needs work', 'Not sure'] }), field('wf-history', 'History & paperwork', 'text', { optional: true, placeholder: 'V5C, service history, restoration records' })],
      ],
    },
    closing: ['Value my car', 'Find out what your car is worth'],
    seo: {
      title: 'Pawn loans against classic cars, London | Trinity Pawnbrokers',
      description: 'Classic and collectable cars valued on history and condition. No credit checks, no logbook loan, insured transport and storage, returned as you left it.',
    },
  },

  /* ---------------------------------- WINE ---------------------------------- */
  {
    slug: 'wine',
    order: 8,
    title: 'Wine',
    nounSingular: 'wine',
    nounPlural: 'fine wine',
    card: ['images/items/wine-card.jpg', 'Fine wine bottles on cellar racks'],
    heroImg: ['images/items/wine-hero.jpg', 'A long cellar lined with wine bottles'],
    cardTeaser: 'Fine wine and rare spirits — in bond or in your cellar.',
    hero: {
      eyebrow: 'Pawn loans against fine wine · City of London · Est. 2013',
      heading: 'Borrow against your *wine*. Keep the cellar.',
      intro: 'Trinity makes pawn loans against fine wine and rare spirits — Bordeaux, Burgundy, Champagne, vintage Port and collectable whisky — from £500 with no maximum. Valued by specialists on producer, vintage, provenance and condition, held in professional bonded storage, and returned to you exactly as you left it when you repay.',
      ctaLabel: 'Value my wine',
    },
    trust: ['Valued on provenance & vintage', 'Professional bonded storage'],
    lendAgainst: {
      heading: 'The wine we lend against',
      intro: 'We lend against wine and spirits with an established secondary market — the bottles and cases that trade at auction and between merchants. Original cases and a clean storage history help most; mixed cellars are welcome.',
      cards: [
        card('ph-wine', 'Bordeaux & Burgundy', 'First growths, grand cru and the leading domaines, in original cases or single bottles.'),
        card('ph-champagne', 'Champagne & vintage Port', 'Prestige cuvées and declared vintages from the houses the market follows.'),
        card('ph-brandy', 'Rare whisky & spirits', 'Collectable single malts, limited releases and aged spirits with a traded market.'),
        card('ph-warehouse', 'Whole cellars', 'Mixed collections valued lot by lot, whether they sit in bond or at home.'),
      ],
    },
    valuation: {
      heading: 'Valued by the bottle, on provenance',
      intro: 'Every lot is assessed by a specialist — producer, vintage, format, fill level, label and capsule condition, and where and how it has been stored — then valued against recent auction and merchant prices. Wine with a clean bonded history is worth more, and we value it that way.',
      points: [
        card('ph-scroll', 'Provenance checked', 'Storage history and purchase records read, not assumed.'),
        card('ph-drop-half', 'Condition assessed', 'Fill levels, labels and capsules, bottle by bottle.'),
        card('ph-chart-line-up', 'Priced against the market', 'Recent auction and merchant results for the same wine.'),
        card('ph-eye', 'Nothing sight-unseen', 'You see the valuation before you commit to anything.'),
      ],
    },
    borrow: {
      heading: 'Valued on the market, not the list price',
      intro: 'Your wine is valued by a specialist against the current secondary market for each wine and vintage — not what it cost, and not a retail list price. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
      example: example(
        'Borrow £[X,XXX] against [X] cases of Bordeaux held in bond for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
        'Indicative only. Your offer depends on the specific wines, their provenance and condition, and the market on the day.',
      ),
    },
    why: {
      heading: 'A pawnbroker for a cellar you intend to *keep*.',
      intro: 'Selling through an auction house or a broker means commission, a wait for the sale, and the wine gone for good. A pawn loan is a loan: you keep ownership, the wine stays in proper storage, and you take it back when you repay. That difference is the whole business.',
      rows: [
        row('Your wine', 'Sold at auction or to a broker, and gone', 'Yours throughout — a loan, never a sale', 'ph-wine'),
        RATES_ROW,
        row('Valuation', 'A generalist, or a buyer’s price', 'Valued by specialists against the secondary market', 'ph-scales'),
        row('Storage', 'Moved, and its provenance with it', 'Kept in professional bonded storage', 'ph-warehouse', 'Bonded storage arrangement to confirm'),
        CREDIT_ROW,
        row('Timing', 'Wait for the next sale', 'Funds within 24 hours of the valuation', 'ph-clock-countdown'),
      ],
    },
    how: {
      heading: 'Four steps. Your wine back at the end.',
      steps: [
        card('ph-chat-teardrop-text', 'Tell us about your wine', 'Send a list — producer, vintage, quantity — and where it is stored. A specialist values it and sends an indicative offer the same day.'),
        card('ph-warehouse', 'We arrange storage', 'Wine already in bond can usually be transferred to our account at the warehouse without moving. Wine at home is collected by specialist, temperature-controlled transport.'),
        card('ph-hand-coins', 'Accept the offer and get paid', 'Once the wine has been inspected and the valuation confirmed, accept and the money is with you within 24 hours.'),
        card('ph-wine', 'Repay, and it’s back with you', 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your wine is returned exactly as you left it.'),
      ],
    },
    faqs: [
      COMMON_FAQ.sell('wine', 'it'),
      faq('My wine is already in bond. Does it have to move?', 'Usually not. Wine held in a recognised bonded warehouse can normally be transferred to our account there, so it never leaves proper storage and its provenance stays intact.', 'In-bond transfer process to confirm'),
      faq('Can you lend against wine stored at home?', 'Yes. We collect it by specialist, temperature-controlled transport and hold it in professional storage. A good home cellar is fine; the condition of the bottles matters more than the address.', 'Collection and storage arrangement to confirm'),
      faq('Do I need the original wooden cases and receipts?', 'They help — original cases and a clean purchase and storage record add value — but they’re not essential. Tell us what you have.'),
      faq('Do you lend against single bottles?', 'Yes, where the bottle is valuable enough on its own. Most loans are against cases or a selection from a cellar.'),
      COMMON_FAQ.cannotRepay('the wine'),
      COMMON_FAQ.credit,
    ],
    form: {
      prefix: 'wine',
      heading: 'What is your wine worth as a loan?',
      intro: 'Tell us what you have — producers, vintages and quantities — and where it is stored, and send a few photos or a cellar list. A specialist reviews it against the current market and comes back with an indicative offer the same day, at no cost and with no obligation.',
      backLabel: '← Back to your wine',
      photosHint: 'Labels, capsules and fill levels, or a photo of your cellar list',
      stepOneRows: [
        [field('wf-type', 'What is it mostly?', 'select', { optional: false, options: ['Bordeaux', 'Burgundy', 'Champagne', 'Port', 'Rhône', 'Italian', 'Whisky / Spirits', 'Mixed cellar', 'Other'] }), field('wf-producer', 'Producer(s)', 'text', { optional: true, placeholder: 'e.g. Château Latour, Krug, Macallan' })],
        [field('wf-vintage', 'Vintage(s)', 'text', { optional: true, placeholder: 'e.g. 2005, or a range' }), field('wf-quantity', 'Quantity', 'text', { optional: true, placeholder: 'e.g. 3 cases of 12' })],
        [field('wf-storage', 'Where is it stored?', 'select', { optional: true, options: ['In bond', 'Professional storage (duty paid)', 'At home', 'Not sure'] })],
      ],
    },
    closing: ['Value my wine', 'Find out what your wine is worth'],
    seo: {
      title: 'Pawn loans against fine wine, London | Trinity Pawnbrokers',
      description: 'Fine wine and rare spirits valued on provenance and the secondary market. No credit checks, held in professional bonded storage, returned as you left it.',
    },
  },

  /* --------------------------- MUSICAL INSTRUMENTS -------------------------- */
  {
    slug: 'musical-instruments',
    order: 9,
    title: 'Musical instruments',
    nounSingular: 'instrument',
    nounPlural: 'musical instruments',
    card: ['images/items/musical-instruments-card.jpg', 'A vintage sunburst electric guitar in warm light'],
    heroImg: ['images/items/musical-instruments-hero.jpg', 'The f-holes and bridge of a cello, close up'],
    cardTeaser: 'Fine stringed instruments, bows and vintage guitars.',
    hero: {
      eyebrow: 'Pawn loans against fine instruments · City of London · Est. 2013',
      heading: 'Borrow against your *instrument*. Play it again when you repay.',
      intro: 'Trinity makes pawn loans against fine musical instruments — violins, violas and cellos, bows, and vintage and collectable guitars — from £500 with no maximum. Valued by specialists on maker, attribution, condition and the market, insured door to door, kept in climate-controlled storage, and returned to you exactly as you left it when you repay.',
      ctaLabel: 'Value my instrument',
    },
    trust: ['Valued on maker & attribution', 'Climate-controlled storage'],
    lendAgainst: {
      heading: 'The instruments we lend against',
      intro: 'We lend against instruments with an established market among players, dealers and collectors. A certificate from a recognised expert helps most; our specialists can assess many instruments without one.',
      cards: [
        card('ph-music-notes', 'Violins, violas & cellos', 'Antique and modern instruments from the Italian, French and English schools, valued on maker and attribution.'),
        card('ph-pen-nib', 'Fine bows', 'Bows by the recognised French and English makers, which can be worth as much as the instrument.'),
        card('ph-guitar', 'Vintage & collectable guitars', 'Pre-CBS Fender, 1950s and ’60s Gibson, pre-war Martin and other collectable electric and acoustic guitars.'),
        card('ph-piano-keys', 'Other fine instruments', 'Wind, brass and keyboard instruments of note, assessed case by case.'),
      ],
    },
    valuation: {
      heading: 'Valued by specialists, on maker and condition',
      intro: 'Every instrument is assessed by a specialist — maker and attribution, originality, condition, any restoration, and the certificates and papers behind it — then valued against recent auction and dealer results for comparable instruments. We value the instrument, not what a shop would offer for it.',
      points: [
        card('ph-magnifying-glass', 'Attribution examined', 'Labels, workmanship and certificates weighed against each other.'),
        card('ph-seal-check', 'Papers valued', 'Expert certificates and provenance add to the valuation.'),
        card('ph-wrench', 'Restoration noted', 'Repairs and replaced parts assessed honestly, not ignored.'),
        card('ph-eye', 'Nothing sight-unseen', 'You see the valuation before you commit to anything.'),
      ],
    },
    borrow: {
      heading: 'Valued for the maker, not the shop price',
      intro: 'Your instrument is valued by a specialist against the current market among dealers and collectors — the maker, the attribution and the condition — not a second-hand shop’s buying price. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
      example: example(
        'Borrow £[X,XXX] against a certificated violin for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
        'Indicative only. Your offer depends on the specific instrument, its maker and condition, and the market on the day.',
      ),
    },
    why: {
      heading: 'A pawnbroker for the instrument you intend to *keep*.',
      intro: 'A dealer buys your instrument or takes it on consignment and sells it on. We don’t. A pawn loan is a loan: you keep ownership, we keep it safe in the right conditions, and you take it back when you repay. That difference is the whole business.',
      rows: [
        row('Your instrument', 'Sold, or consigned and gone', 'Yours throughout — a loan, never a sale', 'ph-music-notes'),
        RATES_ROW,
        row('Valuation', 'A shop’s buying price', 'Valued by specialists on maker and attribution', 'ph-scales'),
        row('Storage', 'A back room', 'Climate-controlled, insured storage', 'ph-thermometer-simple', 'Storage conditions to confirm'),
        CREDIT_ROW,
        row('Redemption', 'Wait for a buyer', 'No early-repayment penalty — redeem the moment you’re ready', 'ph-clock-countdown'),
      ],
    },
    how: {
      heading: 'Four steps. Your instrument back at the end.',
      steps: [
        card('ph-chat-teardrop-text', 'Tell us about your instrument', 'Send the maker, any certificates and a few photos. A specialist values it and sends an indicative offer the same day.'),
        card('ph-package', 'Send it to us, insured', 'We arrange free, fully insured delivery in its case, or you can bring it to our City of London office by appointment. Larger instruments are collected by specialist transport.'),
        card('ph-hand-coins', 'Accept the offer and get paid', 'Once we’ve examined the instrument in person we confirm the valuation. Accept, and the money is with you within 24 hours.'),
        card('ph-music-notes', 'Repay, and it’s back with you', 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your instrument is returned exactly as you left it.'),
      ],
    },
    faqs: [
      COMMON_FAQ.sell('instrument', 'it'),
      faq('Do I need a certificate?', 'It helps, and for the most valuable instruments it may be needed to confirm attribution — but our specialists can assess many instruments without one. Tell us what you have.'),
      faq('How is the instrument kept?', 'In its case, in climate-controlled, insured storage — never played, displayed or lent — and returned exactly as you left it.', 'Storage conditions to confirm'),
      faq('How do I get it to you safely?', 'Free, fully insured delivery in its case, insured up to £25,000 by Royal Mail Special Delivery. Above that, or for cellos and basses, we arrange specialist transport. You can also bring it in by appointment.', 'Specialist transport arrangement to confirm'),
      faq('I’m a professional player. Can I borrow against my working instrument?', 'Talk to us first. A pawn loan means we hold the instrument until you repay, so it suits an instrument you can be without — a second instrument, or a bow you are not using.'),
      COMMON_FAQ.cannotRepay('the instrument'),
      COMMON_FAQ.credit,
    ],
    form: {
      prefix: 'inst',
      heading: 'What is your instrument worth as a loan?',
      intro: 'Tell us what it is, the maker if you know it, and what papers come with it, and send a few photos. A specialist reviews it against the current market and comes back with an indicative offer the same day, at no cost and with no obligation.',
      backLabel: '← Back to your instrument',
      photosHint: 'Front, back and scroll or headstock, the label, and any certificate',
      stepOneRows: [
        [field('wf-type', 'Type of instrument', 'select', { optional: false, options: ['Violin', 'Viola', 'Cello', 'Double bass', 'Bow', 'Guitar', 'Other'] }), field('wf-maker', 'Maker or attribution', 'text', { optional: true, placeholder: 'e.g. J.B. Vuillaume, W.E. Hill & Sons, Gibson' })],
        [field('wf-date', 'Date or period', 'text', { optional: true, placeholder: 'e.g. c. 1870, or 1959' }), field('wf-papers', 'Certificate & papers', 'text', { optional: true, placeholder: 'expert certificate, dendro report, receipts' })],
      ],
    },
    closing: ['Value my instrument', 'Find out what your instrument is worth'],
    seo: {
      title: 'Pawn loans against musical instruments, London | Trinity Pawnbrokers',
      description: 'Fine violins, cellos, bows and vintage guitars valued on maker and attribution. No credit checks, insured, climate-controlled storage, returned as you left it.',
    },
  },
];

/* ---------- build ---------- */

const docs = [];
for (const p of pages) {
  const heroImage = await image(...p.heroImg);
  docs.push({
    _id: `assetPage-${p.slug}`,
    _type: 'assetPage',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    order: p.order,
    nounSingular: p.nounSingular,
    nounPlural: p.nounPlural,
    cardImage: await image(...p.card),
    cardTeaser: p.cardTeaser,
    complianceNote: `Asset template · ${p.title} · ${DRAFT}`,
    hero: {
      _type: 'heroSection',
      image: heroImage,
      eyebrow: p.hero.eyebrow,
      heading: p.hero.heading,
      intro: p.hero.intro,
      ctaPrimary: { _type: 'cta', href: '#value-form', label: p.hero.ctaLabel },
      ctaGhost: { _type: 'cta', href: '#how', label: 'How a pawn loan works' },
      reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
    },
    trust: trust(...p.trust),
    lendAgainst: {
      intro: { eyebrow: 'What we lend against', heading: p.lendAgainst.heading, intro: p.lendAgainst.intro },
      cards: keyed(p.lendAgainst.cards, 'la'),
    },
    valuation: {
      intro: { eyebrow: `How we value ${p.nounPlural}`, heading: p.valuation.heading, intro: p.valuation.intro },
      points: keyed(p.valuation.points, 'val'),
    },
    borrow: {
      intro: { eyebrow: 'How much you can borrow', heading: p.borrow.heading, intro: p.borrow.intro },
      specs: specs(p.slug === 'classic-cars' ? 'Confirm for vehicles' : undefined),
      example: p.borrow.example,
    },
    repExample: silver.repExample,
    why: {
      intro: { eyebrow: 'Why Trinity rather than the alternatives', heading: p.why.heading, intro: p.why.intro },
      rows: keyed(p.why.rows, 'why'),
    },
    proof: { ...silver.proof, caseStudy: caseStudy(p.title) },
    how: {
      intro: { eyebrow: 'How it works', heading: p.how.heading, intro: '' },
      steps: keyed(p.how.steps, 'how'),
      link: { _type: 'cta', href: '/how-it-works', label: 'Read the process in full, including what happens at the end of the term →' },
    },
    faqs: {
      intro: { eyebrow: `${p.title} FAQs`, heading: 'Asked, answered', intro: '' },
      items: keyed(p.faqs, 'faq'),
    },
    form: form(p.form),
    closing: closing(...p.closing),
    seo: { _type: 'seo', noIndex: false, ...p.seo },
  });
}

for (const d of docs) {
  console.log(`${d.slug.current}: ${d.lendAgainst.cards.length} cards, ${d.faqs.items.length} FAQs, ${d.form.stepOneRows.length} form rows`);
}
if (DRY) {
  console.log('--dry-run: nothing written.');
} else {
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log(`Wrote ${docs.length} item pages.`);
}
