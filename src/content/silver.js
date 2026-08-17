/* Trinity — asset page content: SILVER
 *
 * CLIENT FIRST-DRAFT COPY (Trinity_Copy_Silver.md). Copy is verbatim from the client;
 * figures marked with a confirm chip are placeholders pending the sign-off sheet.
 *
 * Per Rito (29 Jul): no LTV messaging on this page — LTV leads on gold only.
 * The worked example is deliberately rate-led and unfilled until compliance
 * confirms a figure.
 *
 * After editing, run:  node scripts/build-asset-pages.mjs silver
 */
export default {
  slug: 'silver',
  noun: { singular: 'piece', plural: 'silver' },

  meta: {
    title: 'Loan Against Silver in London | Pawn Antique & Fine Silver | Trinity Pawnbrokers',
    description: 'Pawn loans against fine and antique silver — hallmarked, maker and period pieces valued beyond the melt. Competitive rates, no credit checks, free insured collection, and your silver returned exactly as you left it. FCA regulated.',
  },

  hero: {
    image: { src: 'images/v2/silver.jpg', alt: 'Antique silver in low light' },
    eyebrow: 'Pawn loans against fine &amp; antique silver · City of London · Est. 2013',
    heading: 'Borrow against your <span>silver</span>. <em>Take it back</em> when you repay.',
    intro: 'Trinity makes pawn loans against fine and antique silver — hallmarked pieces, canteens and services, and maker and period holloware — from £500 with no maximum. Valued for the maker and craftsmanship, not the melt, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my silver', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your silver worth as a loan?',
    intro: 'Tell us what you have, the hallmarks and maker if you know them, and send a few photos. A specialist reviews the piece against the current market — valuing the craftsmanship and maker, not just the metal — and comes back with an indicative offer the same day, at no cost and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your piece',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-type', label: 'Type of piece', type: 'select', options: ['Canteen / Flatware', 'Tea or coffee service', 'Candlesticks', 'Bowl / Dish', 'Figurative / Sculpture', 'Other'] },
        { id: 'wf-maker', label: 'Maker or retailer, if you know it', optional: true, type: 'text', placeholder: 'e.g. Garrard, Mappin &amp; Webb, Georg Jensen' },
      ],
      [
        { id: 'wf-hallmarks', label: 'Hallmarks, if you can read them', optional: true, type: 'text' },
        { id: 'wf-period', label: 'Approximate period', optional: true, type: 'select', options: ['Georgian', 'Victorian', 'Edwardian', '20th c.', 'Not sure'] },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The piece, and a close-up of the hallmarks' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your piece',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, and nothing recorded on your credit file. We’ll never ask you to send your silver before you have an offer you’re happy with.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Valued beyond the melt' },
    { text: 'Funds within 24 hours' },
    { text: 'FCA regulated, ref 741896' },
    { text: 'Free insured collection', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The silver we lend against',
    intro: 'We lend against silver worth keeping — hallmarked antique and maker pieces valued for far more than their weight. Boxes, canteens and paperwork help, but they’re not essential.',
    cards: [
      { icon: 'ph-hourglass', title: 'Antique &amp; period silver',
        body: 'Georgian, Victorian and Edwardian pieces, valued on maker, period and craftsmanship.' },
      { icon: 'ph-fork-knife', title: 'Canteens &amp; flatware',
        body: 'Complete and part services by the established makers, valued as a set, not weighed as scrap.' },
      { icon: 'ph-certificate', title: 'Maker &amp; designer silver',
        body: 'Garrard, Mappin &amp; Webb, Georg Jensen and other names that carry a premium beyond the metal.' },
      { icon: 'ph-coffee', title: 'Fine holloware',
        body: 'Tea and coffee services, candlesticks, bowls and figurative pieces, assessed on their own merit.' },
    ],
  },

  borrow: {
    eyebrow: 'How much you can borrow',
    heading: 'Valued for the maker, not the melt',
    intro: 'Your silver is valued by a specialist — the hallmarks, the maker, the period and the craftsmanship — against the current market for comparable pieces, with silver content as one factor and never the whole story. A fine antique canteen is worth far more than its weight, and that’s how we value it. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
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
      statement: 'Borrow £[X,XXX] against an antique silver service for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
      rows: [
        { label: 'Amount borrowed', value: '£[X,XXX]' },
        { label: 'Term', value: '[X] months' },
        { label: 'Interest', value: '£[XXX]' },
        { label: 'Total to repay', value: '£[X,XXX]' },
        { label: 'Representative APR', value: '[XX.X]%', total: true },
      ],
      note: 'Indicative only. Your offer depends on the specific piece, its maker and condition, and the market on the day.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Your silver back at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your silver',
        body: 'Send the hallmarks, maker and a few photos. A specialist values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'We arrange free, fully insured delivery, or you can bring it to our City of London office by appointment. It’s insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we’ve examined the piece in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-fork-knife', title: 'Repay, and it’s back with you',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your silver is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value silver',
    heading: 'Valued by specialists, for more than the metal',
    intro: 'Every piece is assessed by a specialist — the hallmarks and assay marks, the maker, the period and the craftsmanship — then valued against current market prices for comparable pieces. We don’t weigh your family silver and quote you the melt. Our specialists come from the auction houses and the trade.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Hallmarks read and dated', body: 'Assay marks identified rather than ignored.' },
      { icon: 'ph-certificate', title: 'Maker and period valued', body: 'The premium beyond the metal counts.' },
      { icon: 'ph-fork-knife', title: 'Completeness factored in', body: 'Full canteens and matched services valued as a set.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for silver you intend to <span>keep</span>.',
    intro: 'Cash-for-silver and scrap merchants buy your silver by the gram and melt it. We don’t. A pawn loan is a loan: you keep ownership, we keep it safe, and you take it back when you repay. That difference is the whole business — and we value the piece, not the metal.',
    rows: [
      { icon: 'ph-fork-knife', label: 'Your silver', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought by the gram, and melted' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Lower rates than typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Valued for the maker and craftsmanship', highStreet: 'Weighed for the melt' },
      { icon: 'ph-magnifying-glass', label: 'Expertise', trinity: 'Specialists who read a hallmark and know the period', highStreet: 'A generalist behind the counter' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Held in secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, and nothing recorded on your credit file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed <span class="confirm-chip">Awaiting a consented case</span>',
      statement: '[Silver case study to be supplied — the piece, the sum lent, the timeline, redeemed. No identifiable people, no full customer names.]',
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
    eyebrow: 'Silver FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my silver?', a: 'No. This is a loan against it. You keep ownership throughout and take the piece back when you repay.' },
      { q: 'Will you melt my silver?', a: 'No. Your silver is held securely as it is — not melted, displayed or sold — and returned exactly as you sent it. We value it as a piece, not as scrap.' },
      { q: 'Do I need to know the hallmarks or maker?', a: 'No. It helps the valuation, but our specialists can read the marks themselves. Just send clear photos.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment. <span class="confirm-chip">Process for large services or pieces too big to post</span>' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the piece may be sold, and anything it makes above what you owe comes back to you.' },
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
    heading: 'Find out what your silver is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my silver', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Silver · client first-draft copy · rate/APR and figures pending compliance',
};
