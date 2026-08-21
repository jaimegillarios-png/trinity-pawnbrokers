/* Trinity — asset page content: DIAMONDS
 *
 * CLIENT FIRST-DRAFT COPY (Trinity_Copy_Diamonds.md). Copy is verbatim from the client;
 * figures marked with a confirm chip are placeholders pending the sign-off sheet.
 *
 * Per Rito (29 Jul): no LTV messaging on this page — LTV leads on gold only.
 * The worked example is deliberately rate-led and unfilled until compliance
 * confirms a figure.
 *
 * After editing, run:  node scripts/build-asset-pages.mjs diamonds
 */
export default {
  slug: 'diamonds',
  noun: { singular: 'diamond', plural: 'diamonds' },

  meta: {
    title: 'Loan Against Diamonds in London | Pawn Certified & Loose Diamonds | Trinity Pawnbrokers',
    description: 'Pawn loans against certified and loose diamonds, engagement rings and diamond jewellery. Specialist GIA-aware valuations, competitive rates, no credit checks, free insured collection, and your diamond returned exactly as you left it. FCA regulated.',
  },

  hero: {
    image: { src: 'images/v2/diamonds.jpg', alt: 'A loose diamond held with tweezers' },
    eyebrow: 'Pawn loans against diamonds · City of London · Est. 2013',
    heading: 'Borrow against your <span>diamond</span>. <em>Keep it</em>, and take it back when you repay.',
    intro: 'Trinity makes pawn loans against diamonds — certified and loose stones, engagement rings and fine diamond jewellery — from £500 with no maximum. Valued by specialists on the 4Cs and the market, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my diamond', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your diamond worth as a loan?',
    intro: 'Tell us the carat, the certificate details if you have them, and send a few photos. A diamond specialist reviews it against the current market and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your diamond',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-setting', label: 'Loose or set?', type: 'select', options: ['Loose', 'Ring', 'Necklace/Pendant', 'Earrings', 'Other'] },
        { id: 'wf-carat', label: 'Carat weight', optional: true, type: 'text', placeholder: 'e.g. 1.05' },
      ],
      [
        { id: 'wf-cert', label: 'Certificate?', optional: true, type: 'select', options: ['GIA', 'IGI', 'HRD', 'Other', 'None'] },
        { id: 'wf-cert-no', label: 'Certificate no.', optional: true, type: 'text' },
      ],
      [
        { id: 'wf-colour-clarity', label: 'Colour & clarity', optional: true, type: 'text', placeholder: 'e.g. G, VS1' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The stone, the certificate, and the piece if set' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your diamond',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, and nothing recorded on your credit file. We’ll never ask you to send your diamond before you have an offer you’re happy with.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Valued on the 4Cs and the live market' },
    { text: 'Funds within 24 hours' },
    { text: 'FCA regulated, ref 741896' },
    { text: 'Free insured collection', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The diamonds we lend against',
    intro: 'We lend against diamonds worth keeping — certified investment-grade stones, engagement and dress rings, and fine diamond jewellery. A certificate helps the valuation, but an uncertified stone can still be valued and lent against.',
    cards: [
      { icon: 'ph-certificate', title: 'Certified loose diamonds',
        body: 'GIA, IGI or HRD-certified stones, valued on the 4Cs against current market prices for that grade.' },
      { icon: 'ph-diamond', title: 'Engagement &amp; diamond rings',
        body: 'Solitaires and multi-stone rings — the stone, the setting and the maker all considered.' },
      { icon: 'ph-sparkle', title: 'Diamond jewellery',
        body: 'Necklaces, pendants, earrings and suites, including signed and period pieces.' },
      { icon: 'ph-magnifying-glass', title: 'Uncertified &amp; older stones',
        body: 'No certificate is no barrier — our specialists grade and value the stone on its own merit.' },
    ],
  },

  borrow: {
    eyebrow: 'How much you can borrow',
    heading: 'Valued fairly, on the 4Cs and the market',
    intro: 'Your diamond is valued by a specialist on the 4Cs — carat, cut, colour and clarity — with its certificate where there is one, against current market prices for that grade. Not weighed and averaged like scrap. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
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
      statement: 'Borrow £[X,XXX] against a certified diamond for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
      rows: [
        { label: 'Amount borrowed', value: '£[X,XXX]' },
        { label: 'Term', value: '[X] months' },
        { label: 'Interest', value: '£[XXX]' },
        { label: 'Total to repay', value: '£[X,XXX]' },
        { label: 'Representative APR', value: '[XX.X]%', total: true },
      ],
      note: 'Indicative only. Your offer depends on the specific stone, its certification and condition, and the market on the day.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Your diamond back at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your diamond',
        body: 'Send the carat, the certificate details if you have them, and a few photos. A specialist values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'We arrange free, fully insured delivery, or you can bring it to our City of London office by appointment. It’s insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we’ve examined the diamond in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-diamond', title: 'Repay, and it comes back to you',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your diamond is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value diamonds',
    heading: 'Valued by diamond specialists, on the 4Cs',
    intro: 'Every diamond is assessed by a specialist — carat, cut, colour and clarity, the certificate where there is one, and, for set pieces, the mount and maker — then valued against current market prices for that grade. We don’t weigh and average, and we don’t treat a fine stone as scrap. Our specialists come from the auction houses and the trade.',
    points: [
      { icon: 'ph-diamond', title: 'Graded on the 4Cs', body: 'Carat, cut, colour and clarity, assessed by a specialist.' },
      { icon: 'ph-certificate', title: 'Certificate read and factored in', body: 'GIA, IGI or HRD — helpful, not required.' },
      { icon: 'ph-ring', title: 'Set stones valued whole', body: 'The mount, maker and any secondary stones all counted.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for diamonds you intend to <span>keep</span>.',
    intro: 'We-buy-diamonds and cash-for-diamonds services buy your stone outright. We don’t. A pawn loan is a loan: you keep ownership, we keep it safe, and you take it back when you repay. That difference is the whole business.',
    rows: [
      { icon: 'ph-diamond', label: 'Your diamond', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought outright' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Lower rates than typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Graded properly on the 4Cs', highStreet: 'Weighed and averaged like scrap' },
      { icon: 'ph-certificate', label: 'Expertise', trinity: 'Specialists who read a certificate and know the market', highStreet: 'A generalist behind the counter' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Held in secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, and nothing recorded on your credit file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed <span class="confirm-chip">Awaiting a consented case</span>',
      statement: '[Diamond case study to be supplied — the stone, the sum lent, the timeline, redeemed. No identifiable people, no full customer names.]',
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
    eyebrow: 'Diamond FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my diamond?', a: 'No. This is a loan against it. You keep ownership throughout and take the diamond back when you repay.' },
      { q: 'Do I need a certificate?', a: 'No. A GIA, IGI or HRD certificate helps the valuation, but our specialists can grade and value an uncertified stone. It’s one factor, not a requirement.' },
      { q: 'Will you damage or re-cut my stone?', a: 'No. It’s held securely, not altered, worn, displayed or sold, and returned exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment. <span class="confirm-chip">Process for stones above £25,000</span>' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the diamond may be sold, and anything it makes above what you owe comes back to you.' },
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
    heading: 'Find out what your diamond is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my diamond', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Diamonds · client first-draft copy · rate/APR and figures pending compliance',
};
