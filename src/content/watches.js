/* Trinity — asset page content: WATCHES
 *
 * Everything that differs between the seven asset pages lives here. The layout
 * lives in src/templates/asset-page.mjs and is never edited per asset.
 * After editing, run:  node scripts/build-asset-pages.mjs
 *
 * Inline HTML is allowed in copy fields (<em>, <span>, &mdash; …) — these are
 * trusted, hand-authored strings, not user input.
 */
export default {
  slug: 'watches',
  noun: { singular: 'watch', plural: 'watches' },

  meta: {
    title: 'Pawn loans against luxury watches — Trinity Pawnbrokers',
    description:
      'Borrow against your watch and wear it again when you repay. Trinity makes pawn loans against Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier and more — from £500 with no maximum, valued by specialists in the City of London.',
  },

  hero: {
    image: { src: 'images/watches/hero.jpg', alt: 'A luxury watch dial and bezel in low light' },
    eyebrow: 'Pawnbroker loans against luxury watches<br>City of London · Est. 2013',
    heading: 'Borrow against your <span>watch</span>. <em>Wear it again</em> when you repay.',
    intro:
      'Trinity makes pawn loans against luxury watches — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier and more — from £500 with no maximum. Valued by specialists, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my watch', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  // ---- valuation entry (the conversion object) ----------------------------
  form: {
    heading: 'What is your watch worth as a loan?',
    intro:
      'Tell us the make, model and condition, and send a few photos. A watch specialist reviews it against the current market and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your watch',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    // Each inner array is one row; two fields in a row sit side by side.
    fields: [
      [
        { id: 'wf-brand', label: 'Brand', type: 'select',
          options: ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'Breitling', 'Vacheron Constantin', 'Jaeger-LeCoultre', 'Other'] },
        { id: 'wf-model', label: 'Model or reference', optional: true, type: 'text', placeholder: 'e.g. Submariner 116610LN' },
      ],
      [
        { id: 'wf-papers', label: 'Box and papers?', type: 'select', options: ['Yes', 'Papers only', 'Box only', 'Neither'] },
        { id: 'wf-year', label: 'Approximate year', optional: true, type: 'text', placeholder: 'e.g. 2019' },
      ],
      [
        { id: 'wf-condition', label: 'Condition', optional: true, type: 'select', options: ['Excellent', 'Good', 'Fair'] },
      ],
    ],
    photos: { label: 'Add photos', hint: 'Dial, caseback — and movement if you can' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your watch',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2:
      'Free, no obligation, same-day offer, and nothing recorded on your credit file. We’ll never ask you to send your watch before you have an offer you’re happy with.',
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
    heading: 'The watches we lend against',
    intro:
      'We lend against the watches collectors actually own and intend to keep — modern and vintage, dress and sport, complications and everyday pieces. Box and papers help the valuation, but they’re not essential.',
    cards: [
      { icon: 'ph-watch', title: 'Rolex, Patek Philippe and Audemars Piguet',
        body: 'The pieces we lend against most — Submariner and Daytona, Nautilus and Aquanaut, Royal Oak and beyond.' },
      { icon: 'ph-clock-countdown', title: 'Omega, Cartier, Breitling and more',
        body: 'Established makers with strong resale — Speedmaster, Santos, Tank, Navitimer.' },
      { icon: 'ph-hourglass', title: 'Vintage and rare',
        body: 'Older references and limited pieces, valued on their own merit by specialists who know the market.' },
      { icon: 'ph-package', title: 'With or without box and papers',
        body: 'Missing the box or papers doesn’t rule a watch out — it’s one factor in the valuation, not a dealbreaker.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro:
      'Your watch is valued by a specialist against the current market — the exact reference, its condition, and whether it has its box and papers — not weighed and guessed like scrap. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £5,000 loan against a Rolex Submariner 126610LN, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£5,000' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£1,050' },
        { label: 'Total to repay', value: '£6,050' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note:
        'Illustrative only. Your own figures depend on the specific watch, its condition, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on your wrist at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your watch',
        body: 'Send the make, model and a few photos. A specialist values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we’ve seen the watch in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-watch', title: 'Repay, and it’s back on your wrist',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your watch is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value watches',
    heading: 'Valued by watch specialists, against the market',
    intro:
      'Every watch is assessed by a specialist — then valued against current market prices for that exact model. We don’t weigh it and guess, and we don’t treat a collector’s piece as scrap. Our specialists come from auction houses and the trade.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Authenticated', body: 'Reference, movement and originality of parts, checked by hand.' },
      { icon: 'ph-chart-line-up', title: 'Priced to the market', body: 'Valued against live market prices for the exact model — not a generic estimate.' },
      { icon: 'ph-package', title: 'Box &amp; papers weighed in', body: 'Condition and provenance factored in — helpful, never required.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for watches you intend to <span>keep</span>.',
    intro:
      'We-buy-any-watch and cash-for-watch services buy your watch outright. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-watch', label: 'Your watch', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Often bought outright' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Priced to the live market by a watch specialist', highStreet: 'Weighed and guessed like scrap' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement:
        'A Rolex Daytona, lent against for £14,000. Valued the same day, funds within 24 hours — redeemed four months later and returned exactly as it arrived.',
      rows: [
        { label: 'Piece', value: 'Rolex Daytona' },
        { label: 'Amount lent', value: '£14,000' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 4 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Watch FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my watch?', a: 'No. This is a loan against it. You keep ownership throughout and take the watch back when you repay.' },
      { q: 'Do I need the box and papers?', a: 'No. They help the valuation, but a watch without them can still be lent against — it’s one factor, not a requirement.' },
      { q: 'Will you wear or run my watch?', a: 'No. It’s held securely, not worn, displayed or offered for sale, and returned exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the watch may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £5,000 for 6 months at 3.5% per month; total repayable £6,050; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your watch is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my watch', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Watches instance · no LTV messaging per Rito 29 Jul · rate/APR lead pending compliance',
};
