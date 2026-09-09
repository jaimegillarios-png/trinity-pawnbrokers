/**
 * Puts the real Unbolted catalogue into Sanity as Trinity shop items.
 *
 * Reads what scrape-unbolted.mjs pulled down, uploads each photograph once
 * (Sanity deduplicates on content hash, so re-running does not pile up
 * assets), and maps the specification rows onto the fields the product schema
 * already has — reference, year, warranty and so on — leaving the rest as the
 * spec table they were written as.
 *
 * Run with --replace to clear the placeholder products first.
 */
import { createClient } from '@sanity/client';
import { readFile, readdir } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = resolve(root, 'scripts/data/unbolted');

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('SANITY_API_WRITE_TOKEN is not set.');
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion: '2026-01-01', token, useCdn: false });

/* Longest first, so "Patek Philippe" is not matched as "Patek" and TAG Heuer
   keeps both of its words. */
const BRANDS = [
  'Patek Philippe', 'TAG Heuer', 'Jaeger-LeCoultre', 'Audemars Piguet',
  'Breitling', 'Tudor', 'Omega', 'Rolex', 'Cartier', 'IWC',
].sort((a, b) => b.length - a.length);

const brandOf = (title) => BRANDS.find((b) => title.toLowerCase().startsWith(b.toLowerCase())) ?? '';

/**
 * The source slugs are Squarespace's, and several no longer describe what they
 * point at — the IWC Aquatimer lives at "omega-speedmaster-sold-k69xy-h5bmd-6s8dn",
 * because the page was duplicated from an Omega listing years ago. A URL a
 * buyer might read, or paste to someone, is worth more than matching them.
 */
const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)
    .replace(/-$/, '');

const row = (specs, ...names) =>
  specs.find((s) => names.some((n) => s.label.toLowerCase() === n.toLowerCase()))?.value;

/** "RRP £12,600" and "RRP £5800" both appear. Pence, to match `price`. */
function rrpOf(specs) {
  const text = specs.map((s) => s.value).join(' ');
  const m = text.match(/RRP[^\d£]*£?\s*([\d,]+)/i);
  if (!m) return undefined;
  const pounds = Number(m[1].replace(/,/g, ''));
  return Number.isFinite(pounds) && pounds > 0 ? pounds * 100 : undefined;
}

/**
 * A one-line summary, assembled from the piece's own specification rather than
 * written as marketing. The case and the bracelet are what a buyer scanning a
 * list is actually choosing between.
 */
function summaryOf(product) {
  const bits = [
    row(product.specs, 'Case'),
    row(product.specs, 'Dial'),
    row(product.specs, 'Bracelet/Strap', 'Bracelet', 'Strap'),
  ].filter(Boolean).map((s) => s.replace(/\.$/, ''));
  if (!bits.length) return `${product.title}. Full details on request.`;
  const line = bits.join('. ') + '.';
  return line.length > 260 ? line.slice(0, 257).replace(/[\s,.]+$/, '') + '…' : line;
}

/**
 * Photographs already in Sanity are matched by filename before anything is
 * sent. Sanity deduplicates on content hash so a re-upload is harmless, but it
 * still pushes 27MB up the wire — and this script is re-run every time the
 * catalogue changes.
 */
/**
 * The films, if fetch-videos.mjs has been run. Optional: the catalogue imports
 * perfectly well without them, and they are large enough that fetching them is
 * a deliberate step rather than part of every run.
 */
const videoDir = resolve(data, 'videos');
const haveVideos = new Set(
  existsSync(videoDir) ? (await readdir(videoDir)).filter((f) => f.endsWith('.mp4')) : [],
);

const uploadedFiles = new Map(
  (await client.fetch(`*[_type == "sanity.fileAsset" && defined(originalFilename)]{ _id, originalFilename }`))
    .map((a) => [a.originalFilename, a._id]),
);

async function uploadVideo(file) {
  if (uploadedFiles.has(file)) return uploadedFiles.get(file);
  const asset = await client.assets.upload('file', createReadStream(resolve(videoDir, file)), {
    filename: file,
    contentType: 'video/mp4',
  });
  uploadedFiles.set(file, asset._id);
  return asset._id;
}

const uploaded = new Map(
  (await client.fetch(`*[_type == "sanity.imageAsset" && defined(originalFilename)]{ _id, originalFilename }`))
    .map((a) => [a.originalFilename, a._id]),
);
console.log(`  ${uploaded.size} photographs already in Sanity\n`);

async function upload(file) {
  if (uploaded.has(file)) return uploaded.get(file);
  const asset = await client.assets.upload('image', createReadStream(resolve(data, 'images', file)), {
    filename: file,
  });
  uploaded.set(file, asset._id);
  process.stdout.write('.');
  return asset._id;
}

const products = JSON.parse(await readFile(resolve(data, 'products.json'), 'utf8'));
const allImages = new Set(products.flatMap((p) => p.images.map((i) => i.file)));
const haveImage = (file) => allImages.has(file);

if (process.argv.includes('--replace')) {
  const old = await client.fetch(`*[_type == "product" && title match "*placeholder*"]._id`);
  if (old.length) {
    await old.reduce((tx, id) => tx.delete(id), client.transaction()).commit();
    console.log(`  removed ${old.length} placeholder products\n`);
  }
}

const docs = [];
for (const product of products) {
  const brand = brandOf(product.title);
  const images = [];
  for (const [i, image] of product.images.entries()) {
    images.push({
      _key: `img${i}`,
      _type: 'image',
      asset: { _type: 'reference', _ref: await upload(image.file) },
      alt: image.alt,
    });
  }

  /* Rows that have a field of their own are lifted out; what is left stays in
     the spec table, so nothing from the source is silently dropped. */
  const lifted = ['model ref', 'age', 'warranty', 'condition', 'box', 'papers and accessories', 'other info'];
  const specs = product.specs
    .filter((s) => !lifted.includes(s.label.toLowerCase()))
    .map((s, i) => ({ _key: `spec${i}`, _type: 'specRow', label: s.label, value: s.value }));

  const box = [row(product.specs, 'Box'), row(product.specs, 'Papers and accessories')]
    .filter(Boolean).join('. ');

  const slug = slugify(product.title);

  /* Named by the source slug, because that is what the fetch script sees. */
  const videoFile = `${product.slug}.mp4`;
  const videoAsset = haveVideos.has(videoFile) ? await uploadVideo(videoFile) : null;
  if (videoAsset) process.stdout.write('🎬');

  docs.push({
    _id: `product-${slug}`,
    _type: 'product',
    title: product.title,
    slug: { _type: 'slug', current: slug },
    brand: brand || product.title.split(' ')[0],
    status: product.sold ? 'sold' : 'available',
    price: product.price,
    ...(rrpOf(product.specs) ? { rrp: rrpOf(product.specs) } : {}),
    images,
    summary: summaryOf(product),
    ...(row(product.specs, 'Model Ref') ? { reference: row(product.specs, 'Model Ref') } : {}),
    ...(row(product.specs, 'Age') ? { year: row(product.specs, 'Age') } : {}),
    ...(specs.length ? { specs } : {}),
    ...(row(product.specs, 'Condition') ? { condition: row(product.specs, 'Condition') } : {}),
    ...(box ? { boxAndPapers: box } : {}),
    ...(row(product.specs, 'Warranty') ? { warranty: row(product.specs, 'Warranty') } : {}),
    ...(videoAsset
      ? { video: { _type: 'file', asset: { _type: 'reference', _ref: videoAsset } } }
      : {}),
    seo: {
      _type: 'seo',
      title: `${product.title} | Trinity Pawnbrokers`,
      description: summaryOf(product).slice(0, 155),
    },
  });
  console.log(` ${product.title}`);
}

/**
 * The shop's own copy, and its hero.
 *
 * The words are Unbolted's, because Unbolted is the same firm — Open Access
 * Finance Ltd trading under another name — and this is the shop they already
 * run. What changes is whose counter it is spoken from: "we" is Trinity here,
 * and the relationship between the two names is stated rather than glossed,
 * since the About page already explains it.
 *
 * It lives in this script rather than in migrate-to-sanity.mjs so a full
 * content import cannot overwrite the catalogue, and so the hero can be one of
 * the photographs that came down with it.
 */
const heroImage = await upload(products.find((p) => !p.sold)?.images?.[0]?.file ?? products[0].images[0].file);
/* Named rather than picked by index. "the fourth image of the first product
   with more than six" landed on a caseback on a white sweep — accurate, but a
   catalogue shot, and it is doing no other job on the site. This one is the
   Patek on its stand: three-quarter, angled, with room around it, and not the
   card thumbnail for its own product. */
const STORY_IMAGE = 'patek7041r-09.jpg';
const storyImage = await upload(
  haveImage(STORY_IMAGE) ? STORY_IMAGE : products[0].images[0].file,
);

const block = (text) => ({
  _type: 'block',
  _key: `s${text.length}`,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `t${text.length}`, text, marks: [] }],
});

const card = (icon, title, body) => ({ _type: 'iconCard', _key: title.toLowerCase().replace(/\W+/g, ''), icon, title, body });

await client.createOrReplace({
  _id: 'shopPage',
  _type: 'shopPage',
  hero: {
    _type: 'heroSection',
    image: { _type: 'image', asset: { _type: 'reference', _ref: heroImage }, alt: 'A pre-owned luxury watch from the Trinity collection' },
    eyebrow: 'The shop',
    heading: 'Pre-owned *luxury watches*',
    intro:
      'Explore the collection from Trinity and Unbolted, London’s premier secured asset loan provider. Operating since 2014, we have financed over £30 million of luxury watches — and the best of what passes through the strongroom is offered here.',
    ctaPrimary: { _type: 'cta', label: 'Shop now', href: '/shop/items' },
    ctaGhost: { _type: 'cta', label: 'Sell or part exchange', href: '/contact' },
    reassurance: 'Every watch guaranteed genuine, with a minimum one year warranty.',
  },
  featured: {
    _type: 'sectionIntro',
    eyebrow: 'Available now',
    heading: 'This month’s featured watches',
    intro:
      'We always have a variety of watches in the shop, with inventory changing all the time. Each month our team pick three favourites. Enjoy.',
  },
  intro: {
    _type: 'sectionIntro',
    eyebrow: 'The offer',
    heading: 'What every watch comes with',
  },
  assurances: [
    card('ph-seal-check', 'Peace of mind', 'We guarantee that every watch we sell is 100% genuine, and it comes with a minimum one year warranty.'),
    card('ph-tag', 'Hassle free', 'Our pricing is transparent and fixed, so you do not need to waste time haggling.'),
    card('ph-arrows-left-right', 'Buy, sell, loan', 'As well as buying, selling and part exchanging watches, we can also offer short term loans against them.'),
  ],
  story: {
    heading: 'About the shop',
    image: { _type: 'image', asset: { _type: 'reference', _ref: storyImage }, alt: 'A watch being examined at the bench' },
    body: [
      block('Our primary business, Unbolted, has provided loans against more than £100 million worth of luxury assets since 2014. That gives us access to an extraordinary range of pre-owned watches, which we can now offer to the public.'),
      block('Our team has a combined experience of over thirty years in the watch world, and is here to help whether you are buying, or would like to sell or part exchange your own. We even provide short term loans against watches.'),
      block('Trinity Pawnbrokers and Unbolted are both trading names of Open Access Finance Ltd, authorised and regulated by the Financial Conduct Authority under reference 741896.'),
    ],
  },
  closing: {
    _type: 'closingSection',
    eyebrow: 'Not what you were after?',
    heading: 'Stock changes constantly',
    intro:
      'Pieces arrive as loans end. Tell us what you are looking for and we will let you know when something fits.',
    cta: { _type: 'cta', label: 'Get in touch', href: '/contact' },
    contactPrefix: 'Or speak to a specialist on',
    contactSuffix: 'weekdays, 9.30am to 5pm, by appointment.',
  },
  seo: {
    _type: 'seo',
    title: 'Buy pre-owned luxury watches | Trinity Pawnbrokers',
    description:
      'Pre-owned Tudor, TAG Heuer, Omega and Patek Philippe from the pawnbroker that valued them. Guaranteed genuine, minimum one year warranty, fixed prices.',
  },
});

await docs.reduce((tx, doc) => tx.createOrReplace(doc), client.transaction()).commit();
console.log(
  `\n  ${docs.length} products, ${uploaded.size} images, ` +
    `${uploadedFiles.size} films, shop page written.`,
);
