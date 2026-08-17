/* Trinity — asset page content: FINE ART
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs fine-art
 */
export default {
  slug: 'fine-art',
  noun: { singular: 'work', plural: 'fine art' },

  meta: {
    title: 'Pawn loans against fine art — Trinity Pawnbrokers',
    description: 'Borrow against paintings, prints and sculpture, and keep them yours. Advances against single works or collections, researched and valued against auction records.',
  },

  hero: {
    image: { src: 'images/v2/art.jpg', alt: 'A framed painting lit in a gallery' },
    eyebrow: 'Pawnbroker loans against fine art<br>City of London · Est. 2013',
    heading: 'Borrow against your art. <em>Back on the wall</em> when you repay.',
    intro: 'Trinity makes pawn loans against fine art — paintings, prints, sculpture and works on paper — from £500 with no maximum. Researched and valued against auction records, insured door to door, held in climate-controlled storage in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my work', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your work worth as a loan?',
    intro: 'Tell us the artist and what you know of the work’s history, and send a few photos. A specialist researches it against auction records and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your work',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-artist', label: 'Artist/Maker', type: 'text', placeholder: 'e.g. Bridget Riley' },
        { id: 'wf-provenance', label: 'Provenance', optional: true, type: 'text',
          placeholder: 'e.g. bought at auction, 2018' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your object', optional: true, type: 'text',
          placeholder: 'e.g. oil on canvas, 60 × 80cm, framed' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The whole work, the signature, and the back of the canvas or frame' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your work',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your work before you have an offer you’re happy with.',
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
    heading: 'The art we lend against',
    intro: 'We lend against works with an established market — artists with an auction record, editioned prints, and sculpture. Provenance and condition shape the valuation, and a single work or a whole collection can be pledged.',
    cards: [
      { icon: 'ph-image', title: 'Paintings',
        body: 'Oil, acrylic and watercolour by artists with an established auction record.' },
      { icon: 'ph-stack', title: 'Editioned prints',
        body: 'Signed and numbered editions, valued on artist, edition size and condition.' },
      { icon: 'ph-cube', title: 'Sculpture and objects',
        body: 'Bronze, marble and mixed media, including editioned casts.' },
      { icon: 'ph-folders', title: 'Collections',
        body: 'A single advance against several works, rather than piece by piece.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your work is researched against auction records for that artist — the medium, the period, the edition and the condition — rather than valued on impression. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £12,000 loan against a signed editioned print, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£12,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£2,520' },
        { label: 'Total to repay', value: '£14,520' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the artist, the work, its condition and provenance, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on your wall at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your work',
        body: 'Send the artist, what you know of the work’s history, and a few photos. A specialist researches it and sends an indicative offer the same day.' },
      { icon: 'ph-truck', title: 'Send it to us, insured',
        body: 'Specialist fine-art transport, arranged and fully insured — or bring smaller works to our City of London office by appointment.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have examined the work in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-image', title: 'Back on your wall at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your work is returned exactly as it arrived.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value fine art',
    heading: 'Researched against the auction record',
    intro: 'Every work is researched against what that artist actually achieves at auction — for that medium, that period and that size — and assessed for condition and provenance. We do not value art on impression.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Attribution checked', body: 'Signature, medium and period examined, and questioned where they should be.' },
      { icon: 'ph-chart-line-up', title: 'Valued against auction records', body: 'Comparable results for that artist, not a generic estimate.' },
      { icon: 'ph-certificate', title: 'Provenance weighed in', body: 'Receipts, catalogues and exhibition history lift the valuation.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for art you intend to <span>keep</span>.',
    intro: 'A dealer or auction house sells your work, and it is gone — often months later, after fees. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-image', label: 'Your work', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Consigned and sold' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Researched against auction records by a specialist', highStreet: 'Valued on impression' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Climate-controlled, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'A signed editioned screenprint, lent against for £18,000. Researched and valued in two days, funds released on acceptance — redeemed four months later and returned in its original frame.',
      rows: [
        { label: 'Piece', value: 'Signed screenprint, ed. 40' },
        { label: 'Amount lent', value: '£18,000' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 4 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Fine art FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my work?', a: 'No. This is a loan against it. You keep ownership throughout and take the work back when you repay.' },
      { q: 'Do I need provenance or a receipt?', a: 'No. Provenance helps the valuation and can lift it, but its absence does not rule a work out.' },
      { q: 'Will the work be exhibited or sold?', a: 'No. It is held in climate-controlled storage, not displayed or offered for sale, and returned exactly as it arrived.' },
      { q: 'How do you collect larger works?', a: 'By specialist fine-art transport, arranged by us and fully insured door to door.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the work may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'Can I borrow against several works at once?', a: 'Yes. A collection can be pledged as a single advance rather than piece by piece.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £12,000 for 6 months at 3.5% per month; total repayable £14,520; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your art is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my work', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Fine art instance · dummy copy for layout review · figures pending compliance',
};
