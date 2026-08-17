/* Trinity — asset page content: JEWELLERY
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs jewellery
 */
export default {
  slug: 'jewellery',
  noun: { singular: 'piece', plural: 'jewellery' },

  meta: {
    title: 'Pawn loans against jewellery — Trinity Pawnbrokers',
    description: 'Borrow against rings, necklaces and bracelets — period and modern — and wear them again when you repay. Valued piece by piece by specialists in the City of London.',
  },

  hero: {
    image: { src: 'images/v2/jewellery.jpg', alt: 'A ring examined under a jeweller’s loupe' },
    eyebrow: 'Pawnbroker loans against jewellery<br>City of London · Est. 2013',
    heading: 'Borrow against your jewellery. <em>Wear it again</em> when you repay.',
    intro: 'Trinity makes pawn loans against jewellery — rings, necklaces, bracelets and earrings, period and modern, signed and unsigned — from £500 with no maximum. Valued piece by piece by specialists, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my piece', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your piece worth as a loan?',
    intro: 'Tell us what the piece is and what it is made of, and send a few photos. A specialist values it against the current market and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your piece',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-item-type', label: 'Type of item', type: 'select',
          options: ['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Pendant', 'Brooch', 'Other'] },
        { id: 'wf-metal', label: 'Type of metal', optional: true, type: 'select',
          options: ['Platinum', '18ct Gold', '14ct Gold', '9ct Gold', 'Silver'] },
      ],
      [
        { id: 'wf-brand', label: 'Brand', optional: true, type: 'text',
          placeholder: 'e.g. Cartier, Tiffany & Co.' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your jewellery', optional: true, type: 'text',
          placeholder: 'e.g. a diamond solitaire ring, size M' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The hallmark, any stones close up, and the piece as a whole' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your piece',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your piece before you have an offer you’re happy with.',
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
    heading: 'The jewellery we lend against',
    intro: 'We lend against the pieces people own and intend to keep — an engagement ring, an inherited brooch, a signed piece bought for an anniversary. Boxes and certificates help the valuation, but they are never required.',
    cards: [
      { icon: 'ph-diamond', title: 'Rings, from solitaires to eternity bands',
        body: 'Engagement and dress rings, valued on the stones and the setting rather than weight alone.' },
      { icon: 'ph-circle', title: 'Necklaces, bracelets and earrings',
        body: 'Chains, tennis bracelets, studs and drops, in gold, platinum and silver.' },
      { icon: 'ph-certificate', title: 'Signed and house pieces',
        body: 'Cartier, Tiffany, Bulgari and Van Cleef — signature and provenance factored in.' },
      { icon: 'ph-hourglass', title: 'Period and inherited',
        body: 'Georgian through mid-century, valued on their own merit by specialists who know the market.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your piece is assessed by a specialist — the stones, the metal, the maker and the condition — then valued against what comparable pieces actually sell for. Not weighed and quoted as scrap. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £4,000 loan against a 1.20ct diamond solitaire ring, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£4,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£840' },
        { label: 'Total to repay', value: '£4,840' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the piece, its stones and condition, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on you at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your piece',
        body: 'Send what the piece is, what it is made of, and a few photos. A specialist values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have examined the piece in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-diamond', title: 'Back on you at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your piece is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value jewellery',
    heading: 'Valued piece by piece, by specialists',
    intro: 'Every piece is examined by hand — the stones graded, the metal tested, the maker identified where there is a mark — then valued against what comparable pieces actually achieve. We do not put a collector’s piece on the scales and call it scrap.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Stones graded by hand', body: 'Cut, colour and clarity assessed under the loupe, not estimated from a photo.' },
      { icon: 'ph-flask', title: 'Metal tested', body: 'Carat and metal confirmed by test, hallmarked or not.' },
      { icon: 'ph-certificate', title: 'Maker and provenance weighed in', body: 'A signature or a certificate lifts the valuation — neither is required.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for jewellery you intend to <span>keep</span>.',
    intro: 'Cash-for-jewellery services buy your piece outright, usually for its metal weight. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-diamond', label: 'Your piece', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Often bought outright' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Stones and maker valued, not just the metal', highStreet: 'Weighed and priced as scrap' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'An Art Deco diamond bracelet, lent against for £9,200. Valued the same day, funds within 24 hours — redeemed five months later and returned exactly as it arrived.',
      rows: [
        { label: 'Piece', value: 'Art Deco diamond bracelet' },
        { label: 'Amount lent', value: '£9,200' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 5 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Jewellery FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my jewellery?', a: 'No. This is a loan against it. You keep ownership throughout and take the piece back when you repay.' },
      { q: 'Do I need the box and certificate?', a: 'No. They help the valuation, but a piece without them can still be lent against — it is one factor, not a requirement.' },
      { q: 'Will you wear or display my jewellery?', a: 'No. It is held securely, not worn, displayed or offered for sale, and returned exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the piece may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £4,000 for 6 months at 3.5% per month; total repayable £4,840; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your jewellery is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my piece', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Jewellery instance · dummy copy for layout review · figures pending compliance',
};
