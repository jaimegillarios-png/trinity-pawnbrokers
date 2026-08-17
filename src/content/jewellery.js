/* Trinity — asset page content: JEWELLERY
 *
 * CLIENT FIRST-DRAFT COPY (Trinity_Copy_Jewellery.md). Copy is verbatim from the client;
 * figures marked with a confirm chip are placeholders pending the sign-off sheet.
 *
 * Per Rito (29 Jul): no LTV messaging on this page — LTV leads on gold only.
 * The worked example is deliberately rate-led and unfilled until compliance
 * confirms a figure.
 *
 * After editing, run:  node scripts/build-asset-pages.mjs jewellery
 */
export default {
  slug: 'jewellery',
  noun: { singular: 'piece', plural: 'jewellery' },

  meta: {
    title: 'Loan Against Jewellery in London | Pawn Fine & Branded Jewellery | Trinity Pawnbrokers',
    description: 'Pawn loans against fine, branded and antique jewellery — Cartier, Tiffany, Van Cleef and heirloom pieces. Valued beyond the metal by specialists, competitive rates, no credit checks, free insured collection. Your piece returned exactly as you left it. FCA regulated.',
  },

  hero: {
    image: { src: 'images/v2/jewellery.jpg', alt: 'A ring examined under a jeweller’s loupe' },
    eyebrow: 'Pawn loans against fine jewellery<br>City of London · Est. 2013',
    heading: 'Borrow against your <span>jewellery</span>. <em>Wear it again</em> when you repay.',
    intro: 'Trinity makes pawn loans against fine jewellery — signed pieces by Cartier, Tiffany and Van Cleef &amp; Arpels, gemstone and diamond jewellery, and family heirlooms — from £500 with no maximum. Valued for far more than their metal, insured door to door, held securely in the City of London, and returned to you exactly as you left them when you repay.',
    ctaPrimary: { label: 'Value my jewellery', href: '#value-form' },
    ctaGhost: { label: 'How a pawn loan works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Offer the same day.',
  },

  form: {
    heading: 'What is your jewellery worth as a loan?',
    intro: 'Tell us the maker if you know it, the stones and metal, and send a few photos. A specialist reviews the piece against the current market — valuing the craftsmanship and stones, not just the metal — and comes back with an indicative offer the same day, at no cost and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your piece',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-type', label: 'Type of piece', type: 'select', options: ['Ring', 'Necklace/Pendant', 'Bracelet/Bangle', 'Earrings', 'Brooch', 'Suite', 'Other'] },
        { id: 'wf-maker', label: 'Maker or brand, if you know it', optional: true, type: 'text', placeholder: 'e.g. Cartier, Tiffany, Van Cleef' },
      ],
      [
        { id: 'wf-stones', label: 'Main stones, if any', optional: true, type: 'select', options: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Other', 'None'] },
        { id: 'wf-metal', label: 'Metal', optional: true, type: 'select', options: ['Gold', 'Platinum', 'Other', 'Not sure'] },
      ],
      [
        { id: 'wf-papers', label: 'Any certificates, boxes or paperwork?', optional: true, type: 'text' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The whole piece, any hallmarks and any signature' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your piece',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, and nothing recorded on your credit file. We’ll never ask you to send your jewellery before you have an offer you’re happy with.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Valued beyond the metal' },
    { text: 'Funds within 24 hours' },
    { text: 'FCA regulated, ref 741896' },
    { text: 'Free insured collection', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The jewellery we lend against',
    intro: 'We lend against jewellery worth keeping — signed pieces, gemstone and diamond jewellery, fine gold, and heirlooms with a story. Boxes, papers and certificates help the valuation, but they’re not essential.',
    cards: [
      { icon: 'ph-certificate', title: 'Signed &amp; branded jewellery',
        body: 'Cartier, Tiffany &amp; Co., Van Cleef &amp; Arpels, Bulgari, Boodles and more — valued with the maker’s premium, not just the materials.' },
      { icon: 'ph-diamond', title: 'Gemstone &amp; diamond jewellery',
        body: 'Rings, necklaces, earrings and suites set with diamonds, rubies, sapphires and emeralds.' },
      { icon: 'ph-hand-heart', title: 'Fine gold &amp; heirloom pieces',
        body: 'High-carat and hand-worked gold jewellery, valued for its craftsmanship — not weighed as scrap.' },
      { icon: 'ph-hourglass', title: 'Antique &amp; period jewellery',
        body: 'Georgian, Victorian, Art Deco and mid-century pieces, valued on their own merit by specialists who know the period.' },
    ],
  },

  borrow: {
    eyebrow: 'How much you can borrow',
    heading: 'Valued for the piece, not just the metal',
    intro: 'Your jewellery is valued by a specialist — the maker, the stones, the metal and the craftsmanship — against the current market. A signed piece or a fine gemstone is worth far more as jewellery than as scrap, and that’s how we value it. That means an accurate valuation and a competitive loan, at rates lower than the typical high-street pawnbroker. Loans start at £500, with no upper limit.',
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
      statement: 'Borrow £[X,XXX] against a signed diamond piece for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
      rows: [
        { label: 'Amount borrowed', value: '£[X,XXX]' },
        { label: 'Term', value: '[X] months' },
        { label: 'Interest', value: '£[XXX]' },
        { label: 'Total to repay', value: '£[X,XXX]' },
        { label: 'Representative APR', value: '[XX.X]%', total: true },
      ],
      note: 'Indicative only. Your offer depends on the specific piece, its maker, stones and condition, and the market on the day.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. Back on you at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about your piece',
        body: 'Send the maker, stones and a few photos. A specialist values it and sends an indicative offer the same day.' },
      { icon: 'ph-package', title: 'Send it to us, insured',
        body: 'We arrange free, fully insured delivery, or you can bring it to our City of London office by appointment. It’s insured from the moment it leaves your hands.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once we’ve examined the piece in person we confirm the valuation. Accept, and the money is with you within 24 hours.' },
      { icon: 'ph-diamond', title: 'Repay, and it’s back with you',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your jewellery is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value jewellery',
    heading: 'Valued by specialists, for far more than the metal',
    intro: 'Every piece is assessed by a specialist — the maker and any signature, the stones and their quality, the metal, and the craftsmanship and period — then valued against current market prices for comparable pieces. We don’t melt-weigh a Cartier ring or a Victorian brooch as if it were scrap. Our specialists come from the auction houses, the galleries and the trade.',
    points: [
      { icon: 'ph-certificate', title: 'Maker and signature valued', body: 'The brand premium counts, not just the materials.' },
      { icon: 'ph-diamond', title: 'Stones assessed separately', body: 'Diamonds on the 4Cs, coloured stones on quality.' },
      { icon: 'ph-scales', title: 'Metal factored in, never the whole story', body: 'Gold and platinum content counted as one part of the value.' },
      { icon: 'ph-eye', title: 'Nothing sight-unseen', body: 'You see the valuation before you commit to anything.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than the high street',
    heading: 'A pawnbroker for jewellery you intend to <span>keep</span>.',
    intro: 'Cash-for-jewellery and we-buy-any-jewellery services buy your piece — often by the gram, melting a signed or heirloom piece for its metal. We don’t. A pawn loan is a loan: you keep ownership, we keep it safe, and you take it back when you repay. That difference is the whole business.',
    rows: [
      { icon: 'ph-diamond', label: 'Your piece', trinity: 'Yours throughout — a loan, never a sale', highStreet: 'Bought by the gram, and melted' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Lower rates than typical high-street pawnbroking', trinityChip: 'Needs substantiated APR', highStreet: 'Higher headline APRs' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Valued for the maker, stones and craftsmanship', highStreet: 'Weighed as scrap' },
      { icon: 'ph-certificate', label: 'Expertise', trinity: 'Specialists who recognise a signed piece and value it properly', highStreet: 'A generalist behind the counter' },
      { icon: 'ph-vault', label: 'Storage', trinity: 'Held in secure, insured storage in the City of London', highStreet: 'Varies by branch' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, and nothing recorded on your credit file', highStreet: 'May run credit checks' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed <span class="confirm-chip">Awaiting a consented case</span>',
      statement: '[Jewellery case study to be supplied — the piece, the sum lent, the timeline, redeemed. No identifiable people, no full customer names.]',
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
    eyebrow: 'Jewellery FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my jewellery?', a: 'No. This is a loan against it. You keep ownership throughout and take the piece back when you repay.' },
      { q: 'Will you melt or break up my piece?', a: 'No. Your jewellery is held securely as it is — not worn, altered, displayed or sold — and returned exactly as you sent it. We value it as a piece, not as scrap.' },
      { q: 'Do I need the box, papers or a certificate?', a: 'No. They help the valuation, but a piece without them can still be valued and lent against — they’re one factor, not a requirement.' },
      { q: 'How do I get it to you safely?', a: 'Free, fully insured delivery, insured up to £25,000 by Royal Mail Special Delivery. You can also bring it in by appointment. <span class="confirm-chip">Process for pieces above £25,000</span>' },
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
    heading: 'Find out what your jewellery is worth',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my jewellery', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Jewellery · client first-draft copy · rate/APR and figures pending compliance',
};
