/**
 * Placeholder stock for the shop.
 *
 * These are NOT real pieces. Prices, references and condition notes are
 * invented to exercise the layout — a shop with one item in it tells you
 * nothing about how a shop looks. Replace the lot before the shop is public;
 * every one is marked in the Studio by a title that ends "(placeholder)".
 *
 * Three photographs are cycled between them because the repo has three watch
 * images. Real stock needs its own.
 */
const IMAGES = ['images/watch-alt.jpg', 'images/watch-hero.jpg', 'images/v2/watches.jpg'];

export const PRODUCTS = [
  {
    slug: 'rolex-air-king-placeholder',
    title: 'Rolex Air-King (placeholder)',
    brand: 'Rolex',
    status: 'available',
    price: 749500,
    rrp: 812000,
    summary:
      'A clean Air-King on its original Oyster bracelet, serviced within the last two years.',
    reference: '14010',
    year: '1999',
    specs: [
      ['Case', 'Stainless steel, 34mm'],
      ['Dial', 'Black, applied indices'],
      ['Movement', 'Automatic, calibre 3000'],
      ['Bracelet', 'Oyster, original, full links'],
    ],
    condition:
      'Light surface marks to the bracelet consistent with wear. Case unpolished, lugs sharp. Crystal free of chips. Keeping time within COSC tolerance on our timegrapher.',
    boxAndPapers: 'Box, no papers',
    warranty: '12 months, Trinity',
  },
  {
    slug: 'omega-speedmaster-placeholder',
    title: 'Omega Speedmaster Professional (placeholder)',
    brand: 'Omega',
    status: 'available',
    price: 545000,
    rrp: 632000,
    summary: 'Hesalite Moonwatch, one owner from new, with its full accompanying set.',
    reference: '311.30.42.30.01.005',
    year: '2016',
    specs: [
      ['Case', 'Stainless steel, 42mm'],
      ['Dial', 'Black, luminous indices'],
      ['Movement', 'Manual wind, calibre 1861'],
      ['Bracelet', 'Steel, original'],
    ],
    condition:
      'Very light wear throughout. Hesalite crystal with one shallow scratch at four o’clock, not visible at arm’s length. Chronograph functions all correct.',
    boxAndPapers: 'Full set — box, papers, loupe and strap tool',
    warranty: '12 months, Trinity',
  },
  {
    slug: 'cartier-santos-placeholder',
    title: 'Cartier Santos de Cartier (placeholder)',
    brand: 'Cartier',
    status: 'available',
    price: 498000,
    summary: 'Large model in steel, with both the bracelet and the leather strap.',
    reference: 'WSSA0009',
    year: '2021',
    specs: [
      ['Case', 'Stainless steel, 39.8mm'],
      ['Dial', 'Silvered, Roman numerals'],
      ['Movement', 'Automatic, calibre 1847 MC'],
      ['Bracelet', 'Steel with QuickSwitch, plus black leather strap'],
    ],
    condition:
      'Excellent. Faint hairlines to the case flanks only. Both bracelet and strap present with the changing tool.',
    boxAndPapers: 'Full set',
    warranty: '12 months, Trinity',
  },
  {
    slug: 'tudor-black-bay-placeholder',
    title: 'Tudor Black Bay 58 (placeholder)',
    brand: 'Tudor',
    status: 'available',
    price: 289500,
    summary: 'The 39mm blue, on its riveted bracelet, barely worn.',
    reference: '79030B',
    year: '2022',
    specs: [
      ['Case', 'Stainless steel, 39mm'],
      ['Dial', 'Blue, gilt indices'],
      ['Movement', 'Automatic, calibre MT5402'],
      ['Bracelet', 'Riveted steel, original'],
    ],
    condition: 'As new. No marks found under a loupe. Sticker still on the case back.',
    boxAndPapers: 'Full set',
    warranty: 'Manufacturer warranty to 2027',
  },
  {
    slug: 'jaeger-lecoultre-reverso-placeholder',
    title: 'Jaeger-LeCoultre Reverso Classic (placeholder)',
    brand: 'Jaeger-LeCoultre',
    status: 'reserved',
    price: 412000,
    summary: 'Medium Duoface on an alligator strap. Currently reserved.',
    reference: 'Q2438522',
    year: '2019',
    specs: [
      ['Case', 'Stainless steel, 40.1 x 24.4mm'],
      ['Dial', 'Silvered front, black reverse'],
      ['Movement', 'Manual wind, calibre 854A/2'],
      ['Strap', 'Alligator, original buckle'],
    ],
    condition: 'Light wear to the strap. Case and both dials excellent.',
    boxAndPapers: 'Box and papers',
    warranty: '12 months, Trinity',
  },
  {
    slug: 'breitling-navitimer-placeholder',
    title: 'Breitling Navitimer B01 (placeholder)',
    brand: 'Breitling',
    status: 'sold',
    price: 468000,
    summary: 'The 43mm chronograph in steel. Sold — kept here as a record.',
    reference: 'AB0121211',
    year: '2018',
    specs: [
      ['Case', 'Stainless steel, 43mm'],
      ['Dial', 'Black, silver subdials'],
      ['Movement', 'Automatic chronograph, calibre B01'],
      ['Bracelet', 'Steel, original'],
    ],
    condition: 'Good, with wear consistent with regular use.',
    boxAndPapers: 'Box and papers',
    warranty: 'Expired',
  },
].map((p, i) => ({ ...p, image: IMAGES[i % IMAGES.length] }));
