/* Trinity — asset page content: SILVER
 *
 * DUMMY COPY for layout review — written to the shape of src/content/watches.js.
 * Not signed off: figures carry confirm chips and the representative example is
 * still placeholder. Replace before launch.
 * After editing, run:  node scripts/build-asset-pages.mjs silver
 */
export default {
  slug: 'silver',
  noun: { singular: 'piece', plural: 'silver' },

  meta: {
    title: 'Pawn loans against silver — Trinity Pawnbrokers',
    description: 'Borrow against flatware, hollowware and bullion, and redeem it when you repay. Hallmarks read and weight assessed by specialists in the City of London.',
  },

  hero: {
    image: { src: 'images/v2/silver.jpg', alt: 'Silver bars and coins in low light' },
    eyebrow: 'Pawnbroker loans against silver<br>City of London · Est. 2013',
    heading: 'Borrow against your <span>silver</span>. <em>Yours again</em> when you repay.',
    intro: 'Trinity makes pawn loans against silver — canteens of flatware, hollowware, bars and coins — from £500 with no maximum. Hallmarks read and weight assessed by specialists, insured door to door, held securely in the City of London, and returned to you exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my piece', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your piece worth as a loan?',
    intro: 'Tell us what the pieces are and roughly what they weigh, and send a few photos. A specialist reads the hallmarks and comes back with an indicative offer the same day — at no cost, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your piece',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    // PROPOSED — no source screenshot for silver. Mirrors Gold, which is also
    // weight-led. Confirm against the real form before launch.
    fields: [
      [
        { id: 'wf-item-type', label: 'Type of item', type: 'select',
          options: ['Flatware / cutlery', 'Hollowware', 'Bars or bullion', 'Coins', 'Other'] },
        { id: 'wf-weight-unit', label: 'Weight unit', type: 'select',
          options: ['grams', 'troy ounces'] },
      ],
      [
        { id: 'wf-weight', label: 'Weight', type: 'text', placeholder: 'e.g. 800' },
      ],
      [
        { id: 'wf-describe', label: 'Describe your silver', optional: true, type: 'text',
          placeholder: 'e.g. a canteen of cutlery, 44 pieces' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The hallmark, and each piece laid out' },
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
    intro: 'We lend against silver as bullion and as objects — and the two are valued differently. A Georgian coffee pot is worth more than its weight; a bar is worth exactly its weight. We tell you which you have.',
    cards: [
      { icon: 'ph-fork-knife', title: 'Flatware and canteens',
        body: 'Full services and part sets, valued on maker, pattern and weight.' },
      { icon: 'ph-coffee', title: 'Hollowware',
        body: 'Tea services, salvers, candlesticks and bowls, read by their hallmarks.' },
      { icon: 'ph-stack', title: 'Bars and bullion',
        body: '999 bars and rounds, priced against the live silver market.' },
      { icon: 'ph-coins', title: 'Coins',
        body: 'Pre-1947 British silver and bullion coins, by the piece or the bag.' },
    ],
  },

  borrow: {
    eyebrow: 'What it costs to borrow',
    heading: 'Priced below the high street, in writing',
    intro: 'Your silver is weighed and its hallmarks read — the maker, the assay office and the date letter — so antique pieces are valued as objects rather than as scrap. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker.',
    specs: [
      { label: 'Loan size', value: '£500 upwards' },
      { label: 'Term', value: '6 – 24 months' },
      { label: 'Fees', value: 'No arrangement fee', chip: 'Needs confirmation' },
      { label: 'Credit file', value: 'No credit checks' },
    ],
    example: {
      label: 'Worked example',
      chip: 'Awaiting compliance',
      statement: 'A £1,800 loan against a Victorian canteen of sterling flatware, over 6 months',
      rows: [
        { label: 'Amount borrowed', value: '£1,800' },
        { label: 'Term', value: '6 months' },
        { label: 'Interest', value: '£378' },
        { label: 'Total to repay', value: '£2,178' },
        { label: 'Representative APR', value: '51.1%', total: true },
      ],
      note: 'Illustrative only. Your own figures depend on the maker, the weight and the silver price on the day — you see them in full before you commit to anything.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Your silver back at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your piece',
        body: 'Send what the pieces are, roughly what they weigh, and a few photos of the hallmarks. A specialist values them and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'Free, fully insured delivery — or bring it to our City of London office by appointment. Insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we have weighed and examined the silver in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-fork-knife', title: 'Your silver back at the end',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your silver is returned exactly as you sent it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value silver',
    heading: 'Hallmarks read, weight assessed, valued as objects',
    intro: 'Every piece is weighed and its hallmarks read — maker, assay office and date letter — so an antique service is valued as an antique rather than as scrap. Bullion is priced against the live silver market.',
    points: [
      { icon: 'ph-magnifying-glass', title: 'Hallmarks read', body: 'Maker, assay office and date letter identified rather than ignored.' },
      { icon: 'ph-scales', title: 'Weighed on calibrated scales', body: 'To a tenth of a gram, with the working shown to you.' },
      { icon: 'ph-chart-line-up', title: 'Bullion priced to the market', body: 'Bars and coins valued against the silver price on the day.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for silver you intend to <span>keep</span>.',
    intro: 'Scrap buyers weigh your silver and melt it, whatever it was. We don’t. A pawn loan is a loan — you keep ownership, we keep it safe, and you take it back when you repay.',
    rows: [
      { icon: 'ph-fork-knife', label: 'Your silver', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought outright and melted' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Hallmarks read; antiques valued as objects', highStreet: 'Weighed and priced as scrap' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Below typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, nothing recorded on your file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed',
      statement: 'A Victorian canteen of sterling flatware, lent against for £2,600. Hallmarks read and weighed the same day, funds within 24 hours — redeemed five months later and returned piece for piece.',
      rows: [
        { label: 'Piece', value: 'Victorian sterling canteen' },
        { label: 'Amount lent', value: '£2,600' },
        { label: 'Funds released', value: 'Within 24 hours' },
        { label: 'Outcome', value: 'Redeemed in 5 months' },
      ],
      note: 'Illustrative case study — no identifiable people, no full customer names. Figures to be replaced with a real, consented case.',
    },
  },

  faqs: {
    eyebrow: 'Silver FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my silver?', a: 'No. This is a loan against it. You keep ownership throughout and take it back when you repay.' },
      { q: 'Is antique silver worth more than its weight?', a: 'Often, yes. Maker, pattern and date can carry a piece well above its melt value, and we value it accordingly.' },
      { q: 'Will you melt it down?', a: 'No. It is held securely as it arrived, not melted, polished or broken up, and returned to you exactly as you sent it.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. Larger services can be collected.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the silver may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
      { q: 'How quickly do I get the money?', a: 'An indicative offer the same day, and funds within 24 hours of us confirming the valuation.' },
    ],
  },

  repExample: {
    label: 'Representative example',
    chip: 'Verbatim from compliance',
    statement: 'Borrowing £1,800 for 6 months at 3.5% per month; total repayable £2,178; representative 51.1% APR.',
    note: 'Designed as a first-class element rather than small print — final wording inserted verbatim once signed off. Figures shown are illustrative.',
  },

  closing: {
    eyebrow: 'Get started',
    heading: 'Find out what your silver is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my piece', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Silver instance · dummy copy for layout review · figures pending compliance',
};
