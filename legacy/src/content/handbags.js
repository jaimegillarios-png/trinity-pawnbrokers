/* Trinity — asset page content: DESIGNER HANDBAGS
 *
 * CLIENT FIRST-DRAFT COPY (Trinity_Copy_Handbags.md). Copy is verbatim from the client;
 * figures marked with a confirm chip are placeholders pending the sign-off sheet.
 *
 * Per Rito (29 Jul): no LTV messaging on this page — LTV leads on gold only.
 * The worked example is deliberately rate-led and unfilled until compliance
 * confirms a figure.
 *
 * After editing, run:  node scripts/build-asset-pages.mjs handbags
 */
export default {
  slug: 'handbags',
  noun: { singular: 'handbag', plural: 'designer handbags' },

  meta: {
    title: 'Loan Against Designer Handbags in London | Pawn Hermès, Chanel & More | Trinity Pawnbrokers',
    description: 'Pawn loans against designer handbags — Hermès Birkin &amp; Kelly, Chanel, Louis Vuitton. Specialist authentication, competitive rates, no credit checks, free insured collection, and your bag returned exactly as you left it. FCA regulated.',
  },

  hero: {
    image: { src: 'images/v2/bags.jpg', alt: 'A quilted designer handbag with gold hardware' },
    eyebrow: 'Pawn loans against designer handbags · City of London · Est. 2013',
    heading: 'Borrow against your <span>handbag</span>. <em>Carry it again</em> when you repay.',
    intro: 'Trinity makes pawn loans against designer handbags — Hermès Birkin and Kelly, Chanel, Louis Vuitton and other established makers — from £500 with no maximum. Authenticated and valued by specialists, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my handbag', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your handbag worth as a loan?',
    intro: 'Tell us the brand, model and condition, and send a few photos. A specialist authenticates and values it against the current resale market and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your handbag',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-brand', label: 'Brand', type: 'select', options: ['Hermès', 'Chanel', 'Louis Vuitton', 'Dior', 'Gucci', 'Prada', 'Other'] },
        { id: 'wf-model', label: 'Model', optional: true, type: 'text', placeholder: 'e.g. Birkin 30, Classic Flap, Neverfull' },
      ],
      [
        { id: 'wf-colour', label: 'Colour &amp; material', optional: true, type: 'text' },
        { id: 'wf-condition', label: 'Condition', optional: true, type: 'select', options: ['Excellent', 'Good', 'Fair'] },
      ],
      [
        { id: 'wf-completeness', label: 'Box, dust bag &amp; receipt?', type: 'select', options: ['All', 'Some', 'None'] },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The bag, the interior stamp or date code, and the hardware' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your handbag',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, and nothing recorded on your credit file. We’ll never ask you to send your handbag before you have an offer you’re happy with.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Specialist authentication' },
    { text: 'Funds within 24 hours' },
    { text: 'FCA regulated, ref 741896' },
    { text: 'Free insured collection', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The handbags we lend against',
    intro: 'We lend against the bags that hold their value — iconic models from the established makers, in good, honest condition. Boxes, dust bags and receipts help the valuation, but they’re not essential.',
    cards: [
      { icon: 'ph-handbag', title: 'Hermès',
        body: 'Birkin and Kelly above all — the strongest resale in the category — plus Constance and other sought-after models.' },
      { icon: 'ph-diamond', title: 'Chanel',
        body: 'Classic Flap, 2.55, Boy and other enduring designs, valued on model, leather and condition.' },
      { icon: 'ph-suitcase', title: 'Louis Vuitton, Dior &amp; more',
        body: 'Established makers with reliable resale — from Neverfull and Capucines to Lady Dior.' },
      { icon: 'ph-sparkle', title: 'Limited &amp; exotic',
        body: 'Rare colours, limited editions and exotic leathers, valued on their own merit by specialists who know the market.' },
    ],
  },

  borrow: {
    eyebrow: 'How much you can borrow',
    heading: 'Valued fairly, against the resale market',
    intro: 'Your handbag is valued by a specialist against the current resale market — the exact model, its condition, the hardware and leather, and whether it has its box, dust bag and receipt. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 months, renewable' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    // Rate-led, not LTV-led (per Rito). Figures land once compliance signs off.
    example: {
      label: 'Worked example',
      chip: 'Rate-led example awaiting compliance',
      statement: 'Borrow £[X,XXX] against a Hermès Birkin for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
      rows: [
        { label: 'Amount borrowed', value: '£[X,XXX]' },
        { label: 'Term', value: '[X] months' },
        { label: 'Interest', value: '£[XXX]' },
        { label: 'Total to repay', value: '£[X,XXX]' },
        { label: 'Representative APR', value: '[XX.X]%', total: true },
      ],
      note: 'Indicative only. Your offer depends on the specific bag, its condition, and the market on the day.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on your arm at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your handbag',
        body: 'Send the brand, model and a few photos. A specialist authenticates and values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'We arrange free, fully insured delivery, or you can bring it to our City of London office by appointment. It’s insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we’ve authenticated the bag in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-handbag', title: 'Repay, and it’s back with you',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your handbag is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value designer handbags',
    heading: 'Authenticated and valued by specialists',
    intro: 'Every handbag is authenticated and assessed by a specialist — the brand and model, the date code or stamp, the hardware, the leather and stitching, and the overall condition — then valued against current resale prices for that exact model. We know the difference between genuine and the superfakes flooding the market, and we value the real thing properly.',
    points: [
      { icon: 'ph-seal-check', title: 'Authenticated', body: 'Stamps, date codes, hardware and construction checked.' },
      { icon: 'ph-chart-line-up', title: 'Valued against live resale', body: 'Current prices for the exact model, not a generic estimate.' },
      { icon: 'ph-package', title: 'Completeness counted', body: 'Box, dust bag and receipt factored in — helpful, not required.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for the <span>handbag</span> you intend to keep.',
    intro: 'We-buy-designer-bags and cash-for-handbag services buy your bag outright. We don’t. A pawn loan is a loan: you keep ownership, we keep it safe, and you take it back when you repay. That difference is the whole business.',
    rows: [
      { icon: 'ph-handbag', label: 'Your bag', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought outright' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Lower rates than typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-seal-check', label: 'Authentication', trinity: 'Specialist authentication — the genuine article valued properly, not doubted', highStreet: 'Doubted, or not checked at all' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Fair market valuations against real resale prices', highStreet: 'A flat rate, whatever the model' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Held in secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, and nothing recorded on your credit file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed <span class="confirm-chip">Awaiting a consented case</span>',
      statement: '[Handbag case study to be supplied — the bag, the sum lent, the timeline, redeemed. No identifiable people, no full customer names.]',
      rows: [
        { label: 'Piece', value: '[confirm]' },
        { label: 'Amount lent', value: '[confirm]' },
        { label: 'Funds released', value: '[confirm]' },
        { label: 'Outcome', value: '[confirm]' },
      ],
      note: 'Illustrative placeholder — to be replaced with a real, consented case. No identifiable people, no full customer names.',
    },
  },

  faqs: {
    eyebrow: 'Handbag FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my handbag?', a: 'No. This is a loan against it. You keep ownership throughout and take the bag back when you repay.' },
      { q: 'Do I need the box, dust bag and receipt?', a: 'No. They help the valuation, but a bag without them can still be authenticated and lent against — they’re one factor, not a requirement.' },
      { q: 'How do I know you’ll authenticate it fairly?', a: 'Our specialists authenticate against the maker’s own construction, stamps and hardware. We value genuine bags on their real resale worth — being new to us is no reason for a piece to be doubted.' },
      { q: 'Will you use or display my bag?', a: 'No. It’s held securely, not carried, displayed or sold, and returned exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the bag may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'FCA representative example to be inserted verbatim from compliance.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your handbag is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my handbag', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Designer handbags · client first-draft copy · rate/APR and figures pending compliance',
};
