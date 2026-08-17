/* Trinity — asset page content: DESIGNER HANDBAGS
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs handbags
 */
export default {
  slug: 'handbags',
  noun: { singular: 'handbag', plural: 'designer handbags' },

  meta: {
    title: 'Pawn loans against designer handbags — Trinity Pawnbrokers',
    description: 'Borrow against Hermès, Chanel and Louis Vuitton, and carry them again when you repay. Authenticated and condition-graded by specialists in the City of London.',
  },

  hero: {
    image: { src: 'images/v2/bags.jpg', alt: 'A quilted designer handbag with gold hardware' },
    eyebrow: 'Pawnbroker loans against designer handbags<br>City of London · Est. 2013',
    heading: 'Borrow against your handbag. <em>Carry it again</em> when you repay.',
    intro: 'Trinity makes pawn loans against designer handbags — Hermès, Chanel, Louis Vuitton, Dior and more — from £500 with no maximum. Authenticated and condition-graded by specialists, insured door to door, stored flat and stuffed in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my handbag', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your handbag worth as a loan?',
    intro: 'Tell us the brand, the model and the material, and send a few photos. A specialist authenticates it and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your handbag',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-brand', label: 'Brand', type: 'text', placeholder: 'e.g. Hermès' },
        { id: 'wf-model', label: 'Model', type: 'text', placeholder: 'e.g. Birkin 30' },
      ],
      [
        { id: 'wf-material', label: 'Material', type: 'text', placeholder: 'e.g. Togo leather' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your bag', optional: true, type: 'text',
          placeholder: 'e.g. gold hardware, with dust bag and receipt' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The front, the hardware and heat stamp, and the interior label' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your handbag',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your handbag before you have an offer you’re happy with.',
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
    heading: 'The handbags we lend against',
    intro: 'We lend against the bags that hold their value — the house classics, exotic skins, and limited or seasonal pieces. Dust bag, box and receipt help the valuation, but a bag without them is still lent against.',
    cards: [
      { icon: 'ph-handbag', title: 'Hermès',
        body: 'Birkin, Kelly and Constance, valued on leather, hardware, stamp and condition.' },
      { icon: 'ph-diamond', title: 'Chanel',
        body: 'Classic Flap, 2.55 and Boy — full sets and bags without their papers.' },
      { icon: 'ph-suitcase', title: 'Louis Vuitton, Dior and Gucci',
        body: 'House classics with a strong resale market.' },
      { icon: 'ph-sparkle', title: 'Exotics and limited editions',
        body: 'Crocodile, alligator and ostrich, and seasonal pieces with collector demand.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your bag is authenticated and condition-graded by a specialist — the leather, the stitching, the hardware and the stamp — then valued against what that model actually resells for today. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £9,000 loan against a Hermès Birkin 30 in Togo leather, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£9,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£1,890' },
        { label: 'Total to repay', value: '£10,890' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the model, the leather and hardware, its condition, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on your arm at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your handbag',
        body: 'Send the brand, the model, the material and a few photos. A specialist authenticates it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have authenticated the bag in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-handbag', title: 'Back on your arm at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your bag is returned exactly as you sent it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value designer handbags',
    heading: 'Authenticated and condition-graded by specialists',
    intro: 'Every bag is authenticated by hand — the stamp, the stitching, the hardware and the lining — then condition-graded and valued against what that exact model resells for today. We do not price a Birkin from a photograph.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Authenticated by hand', body: 'Heat stamp, date code, stitching and hardware checked in person.' },
      { icon: 'ph-chart-line-up', title: 'Priced to the resale market', body: 'Valued against what that model and leather actually achieve today.' },
      { icon: 'ph-package', title: 'Full set weighed in', body: 'Dust bag, box and receipt lift the valuation — none of them are required.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for handbags you intend to <span>keep</span>.',
    intro: 'Resale sites and consignment shops sell your bag, and it is gone — often at a fee. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-handbag', label: 'Your bag', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Consigned and sold' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Authenticated and condition-graded in person', highStreet: 'Priced from a photograph' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Stored flat and stuffed, insured, in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'A Hermès Birkin 30 in Togo leather, lent against for £9,400. Authenticated the same day, funds within 24 hours — redeemed four months later and returned with its dust bag.',
      rows: [
        { label: 'Piece', value: 'Hermès Birkin 30' },
        { label: 'Amount lent', value: '£9,400' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 4 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Handbag FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my bag?', a: 'No. This is a loan against it. You keep ownership throughout and take the bag back when you repay.' },
      { q: 'Do I need the box, dust bag and receipt?', a: 'No. A full set lifts the valuation, but a bag without them can still be lent against.' },
      { q: 'Will the bag be used or displayed?', a: 'No. It is stored flat and stuffed to hold its shape, not carried, displayed or offered for sale.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if the bag has wear?', a: 'Wear is expected and priced in. Condition shapes the valuation rather than ruling a bag out.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £9,000 for 6 months at 3.5% per month; total repayable £10,890; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your handbag is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my handbag', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Designer handbags instance · dummy copy for layout review · figures pending compliance',
};
