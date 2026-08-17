/* Trinity — asset page content: DIAMONDS
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs diamonds
 */
export default {
  slug: 'diamonds',
  noun: { singular: 'diamond', plural: 'diamonds' },

  meta: {
    title: 'Pawn loans against diamonds — Trinity Pawnbrokers',
    description: 'Borrow against certificated and uncertificated diamonds, set or loose, and redeem them when you repay. Graded by hand and valued against the market in the City of London.',
  },

  hero: {
    image: { src: 'images/v2/diamonds.jpg', alt: 'A loose diamond held with tweezers' },
    eyebrow: 'Pawnbroker loans against diamonds<br>City of London · Est. 2013',
    heading: 'Borrow against your diamonds. <em>Yours again</em> when you repay.',
    intro: 'Trinity makes pawn loans against diamonds — certificated and uncertificated, loose or set — from £500 with no maximum. Graded by hand, insured door to door, held securely in the City of London, and returned to you exactly as you left them when you repay.',
    ctaPrimary: { label: 'Value my diamond', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your diamond worth as a loan?',
    intro: 'Tell us the shape and carat weight, and send a few photos along with the certificate if you have one. A specialist grades it and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your diamond',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    // PROPOSED — no source screenshot for diamonds. Mirrors the shape of the
    // confirmed assets (identifiers, then an optional free-text description).
    // Confirm against the real form before launch.
    fields: [
      [
        { id: 'wf-shape', label: 'Shape', type: 'select',
          options: ['Round brilliant', 'Princess', 'Oval', 'Emerald', 'Cushion', 'Pear', 'Marquise', 'Asscher', 'Radiant', 'Heart', 'Other'] },
        { id: 'wf-certificate', label: 'Certificate', optional: true, type: 'select',
          options: ['GIA', 'IGI', 'HRD', 'Other', 'None'] },
      ],
      [
        { id: 'wf-carat-weight', label: 'Carat weight', type: 'text', placeholder: 'e.g. 1.05' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your diamond', optional: true, type: 'text',
          placeholder: 'e.g. loose stone, colour G, clarity VS1' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The certificate if you have one, and the stone from above and the side' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your diamond',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your diamond before you have an offer you’re happy with.',
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
    heading: 'The diamonds we lend against',
    intro: 'We lend against stones with and without paperwork, loose or still in their setting. A GIA certificate makes the valuation faster and firmer, but its absence is not a barrier — we grade the stone ourselves.',
    cards: [
      { icon: 'ph-certificate', title: 'Certificated stones',
        body: 'GIA, IGI and HRD papers — valued quickly and firmly against the current market for that grade.' },
      { icon: 'ph-magnifying-glass', title: 'Uncertificated stones',
        body: 'No paperwork needed. We grade cut, colour and clarity by hand before valuing.' },
      { icon: 'ph-diamond', title: 'Set and loose',
        body: 'Still in a ring or mount, or loose in a parcel — both are lent against.' },
      { icon: 'ph-stack', title: 'Parcels and melee',
        body: 'Smaller stones by the parcel, valued by total weight and average grade.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your stone is graded for cut, colour, clarity and carat — by a gemmologist, under a loupe — then valued against what comparable stones actually achieve. Not estimated from a photograph. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £6,000 loan against a certificated 1.50ct round brilliant, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£6,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£1,260' },
        { label: 'Total to repay', value: '£7,260' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the stone’s grade, whether it is certificated, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Your stone back at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your diamond',
        body: 'Send the shape, the carat weight and a few photos — plus the certificate if you have one. A specialist grades it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have graded the stone in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-diamond', title: 'Your stone back at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your stone is returned exactly as you sent it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value diamonds',
    heading: 'Graded by gemmologists, against the market',
    intro: 'Every stone is graded under the loupe for cut, colour, clarity and carat, then valued against what comparable stones actually sell for. A certificate speeds that up; it does not replace the examination.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Graded under the loupe', body: 'Cut, colour, clarity and carat assessed by hand, certificate or not.' },
      { icon: 'ph-certificate', title: 'Papers verified', body: 'Where there is a GIA, IGI or HRD report, we check the stone against it.' },
      { icon: 'ph-chart-line-up', title: 'Priced to the market', body: 'Valued against current prices for that grade — not a generic estimate.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for diamonds you intend to <span>keep</span>.',
    intro: 'Diamond buyers purchase your stone outright, and it is gone. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-diamond', label: 'Your stone', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Often bought outright' },
      { icon: 'ph-magnifying-glass', label: 'Valuation', trinity: 'Graded by a gemmologist against the live market', highStreet: 'Estimated at a glance, or by photo' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'A certificated 2.01ct round brilliant, lent against for £11,500. Graded the same day, funds within 24 hours — redeemed six months later and returned with its certificate.',
      rows: [
        { label: 'Piece', value: '2.01ct round brilliant' },
        { label: 'Amount lent', value: '£11,500' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 6 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Diamond FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my diamond?', a: 'No. This is a loan against it. You keep ownership throughout and take the stone back when you repay.' },
      { q: 'Do I need a certificate?', a: 'No. A GIA, IGI or HRD report makes the valuation faster and firmer, but we grade uncertificated stones ourselves.' },
      { q: 'Can I borrow against a stone still in its ring?', a: 'Yes. Set or loose, both are lent against, and we never remove a stone from its mount.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the stone may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £6,000 for 6 months at 3.5% per month; total repayable £7,260; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your diamond is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my diamond', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Diamonds instance · dummy copy for layout review · figures pending compliance',
};
