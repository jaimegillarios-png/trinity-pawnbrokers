/* Trinity — asset page content: GOLD
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs gold
 */
export default {
  slug: 'gold',
  noun: { singular: 'gold item', plural: 'gold' },

  meta: {
    title: 'Pawn loans against gold — Trinity Pawnbrokers',
    description: 'Borrow against sovereigns, bars and jewellery gold, and redeem it when you repay. Tested and weighed by specialists, priced against the live market, held securely in the City of London.',
  },

  hero: {
    image: { src: 'images/v2/gold.jpg', alt: 'Gold bars and sovereigns under low light' },
    eyebrow: 'Pawnbroker loans against gold · City of London · Est. 2013',
    heading: 'Borrow against your gold. <em>Yours again</em> when you repay.',
    intro: 'Trinity makes pawn loans against gold — sovereigns and krugerrands, bars, and the jewellery gold in a drawer — from £500 with no maximum. Tested and weighed by specialists, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my gold item', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your gold item worth as a loan?',
    intro: 'Tell us the carat and the weight, and send a few photos. A specialist prices it against the live gold market and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your gold item',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-carat', label: 'Carat', type: 'select',
          options: ['9ct', '14ct', '18ct', '22ct', '24ct', 'Not sure'] },
        { id: 'wf-weight-unit', label: 'Weight unit', type: 'select',
          options: ['grams', 'troy ounces'] },
      ],
      [
        { id: 'wf-weight', label: 'Weight', type: 'text', placeholder: 'e.g. 40' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your gold', optional: true, type: 'text',
          placeholder: 'e.g. two rings, a chain and a sovereign' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The hallmark if you can find it, and each piece laid out' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your gold item',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your gold item before you have an offer you’re happy with.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Valued against the live market' },
    { text: 'Funds within 24 hours' },
    { text: 'FCA regulated · Ref 741896' },
    { text: 'Free insured collection', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The gold we lend against',
    intro: 'We lend against gold in every form people actually hold it — coins and bars bought as an investment, jewellery worn for years, and pieces that are broken or never worn again. Hallmarks help, but we test what we cannot read.',
    cards: [
      { icon: 'ph-coins', title: 'Sovereigns, krugerrands and coins',
        body: 'Bullion coins and older sovereigns, priced against the live gold market rather than a flat scrap rate.' },
      { icon: 'ph-stack', title: 'Bars and bullion',
        body: 'From single grams to kilo bars, with or without their assay certificates.' },
      { icon: 'ph-diamond', title: 'Jewellery gold',
        body: 'Chains, rings and bracelets — 9ct through 24ct, hallmarked or tested by hand.' },
      { icon: 'ph-package', title: 'Broken and odd pieces',
        body: 'Single earrings, snapped chains, the things you will never wear again. Gold is still gold.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your gold is tested for carat and weighed to a tenth of a gram, then priced against the gold market on the day — not a flat scrap rate set months ago. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £3,000 loan against 120g of 18ct gold, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£3,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£630' },
        { label: 'Total to repay', value: '£3,630' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the carat, the weight and the gold price on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Your gold back at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your gold item',
        body: 'Send the carat, the weight and a few photos. A specialist prices it against the live market and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have tested and weighed it in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-coins', title: 'Your gold back at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your gold is returned exactly as you sent it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value gold',
    heading: 'Tested, weighed and priced to the live market',
    intro: 'Every piece is tested for carat and weighed on calibrated scales, then priced against the gold market that day. We do not glance at a hallmark and guess, and we do not apply a flat rate to everything that crosses the counter.',
    points: [
      { icon: 'ph-flask', title: 'Tested, not assumed', body: 'Carat confirmed by test, whether or not there is a legible hallmark.' },
      { icon: 'ph-chart-line-up', title: 'Priced to the live market', body: 'Valued against the gold price on the day, not a rate set weeks ago.' },
      { icon: 'ph-scales', title: 'Weighed to a tenth of a gram', body: 'On calibrated scales, with the working shown to you.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for gold you intend to <span>keep</span>.',
    intro: 'Cash-for-gold services buy your gold outright, and then it is gone. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-coins', label: 'Your gold', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought outright and melted' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Tested and weighed, priced to the live market', highStreet: 'A flat scrap rate, weighed out of sight' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'A parcel of gold sovereigns, lent against for £6,400. Tested and weighed the same day, funds within 24 hours — redeemed three months later and returned coin for coin.',
      rows: [
        { label: 'Piece', value: '18 gold sovereigns' },
        { label: 'Amount lent', value: '£6,400' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 3 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Gold FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my gold?', a: 'No. This is a loan against it. You keep ownership throughout and take the gold back when you repay.' },
      { q: 'What if it isn’t hallmarked?', a: 'That is common, and not a problem. We test the carat rather than relying on a stamp.' },
      { q: 'Will you melt it down?', a: 'No. It is held securely as it arrived, not melted, sold or broken up, and returned to you exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the gold may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £3,000 for 6 months at 3.5% per month; total repayable £3,630; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your gold is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my gold item', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Gold instance · dummy copy for layout review · figures pending compliance',
};
