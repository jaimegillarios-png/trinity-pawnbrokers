/* Trinity — asset page content: SILVER
 *
 * SCAFFOLD. Every TODO below is placeholder copy awaiting a writer.
 * Structure matches src/content/watches.js — see that file for a worked example.
 * After editing, run:  node scripts/build-asset-pages.mjs silver
 */
export default {
  slug: 'silver',
  noun: { singular: 'piece', plural: 'silver' },

  meta: {
    title: 'Pawn loans against silver — Trinity Pawnbrokers',
    description: 'TODO — one-sentence description for search results, mentioning silver, £500 minimum and the City of London.',
  },

  hero: {
    image: { src: 'images/v2/silver.jpg', alt: 'TODO — describe the piece image' },
    eyebrow: 'Pawnbroker loans against silver · City of London · Est. 2013',
    heading: 'TODO — headline. <em>Gold italic phrase</em> completes it.',
    intro: 'TODO — what we lend against, from £500 with no maximum, valued by specialists, insured door to door, returned exactly as you left it.',
    ctaPrimary: { label: 'Value my piece', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your piece worth as a loan?',
    intro: 'TODO — what to send us and what happens next.',
    stepLabels: {
      1: 'Step 1 of 2 · Your piece',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    // TODO — replace with the fields that actually matter for silver.
    fields: [
      [
        { id: 'wf-type', label: 'TODO — type', type: 'select', options: ['TODO option 1', 'TODO option 2', 'Other'] },
        { id: 'wf-detail', label: 'TODO — detail', optional: true, type: 'text', placeholder: 'e.g. TODO' },
      ],
      [
        { id: 'wf-condition', label: 'Condition', optional: true, type: 'select', options: ['Excellent', 'Good', 'Fair'] },
      ],
    ],
    photos: { label: 'Add photos', hint: 'TODO — which angles help the valuation' },
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
    heading: 'The silver we lend against',
    intro: 'TODO — the range we lend against and what does or does not matter.',
    cards: [
      { icon: 'ph-diamond', title: 'TODO — category one', body: 'TODO — one or two sentences.' },
      { icon: 'ph-certificate', title: 'TODO — category two', body: 'TODO — one or two sentences.' },
      { icon: 'ph-hourglass', title: 'TODO — category three', body: 'TODO — one or two sentences.' },
      { icon: 'ph-package', title: 'TODO — category four', body: 'TODO — one or two sentences.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'TODO — how silver are valued, and why that beats the high street.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'TODO — a £X,XXX loan against a specific piece, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£TODO' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£TODO' },
        { label: 'Total to repay', value: '£TODO' },
        { label: 'Representative APR', value: 'TODO%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the specific piece, its condition, and the market on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'TODO — four steps, ending with the piece back with you.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your piece', body: 'TODO' },
      { icon: 'ph-package', title: 'Send it to us, insured', body: 'TODO' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid', body: 'TODO' },
      { icon: 'ph-arrow-u-up-left', title: 'Repay, and it comes back', body: 'TODO' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value silver',
    heading: 'TODO — valued by specialists, against the market',
    intro: 'TODO — who values it and against what.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'TODO', body: 'TODO' },
      { icon: 'ph-chart-line-up', title: 'Priced to the market', body: 'TODO' },
      { icon: 'ph-certificate', title: 'TODO', body: 'TODO' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for silver you intend to <span>keep</span>.',
    intro: 'TODO — we lend against it, we do not buy it.',
    rows: [
      { icon: 'ph-diamond', label: 'Your piece', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Often bought outright' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'TODO', highStreet: 'Weighed and guessed like scrap' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'TODO — a real, consented case: what it was, what we lent, how fast, and that it was redeemed.',
      rows: [
        { label: 'Piece', value: 'TODO' },
        { label: 'Amount lent', value: '£TODO' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'TODO' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Silver FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my piece?', a: 'No. This is a loan against it. You keep ownership throughout and take it back when you repay.' },
      { q: 'TODO — an objection specific to silver', a: 'TODO' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the item may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'TODO — inserted verbatim once compliance signs it off.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your piece is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my piece', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Silver instance · PLACEHOLDER COPY — not for review',
};
