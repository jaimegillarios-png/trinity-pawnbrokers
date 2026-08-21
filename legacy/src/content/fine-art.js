/* Trinity — asset page content: FINE ART
 *
 * CLIENT FIRST-DRAFT COPY (Trinity_Copy_FineArt.md). Copy is verbatim from the client;
 * figures marked with a confirm chip are placeholders pending the sign-off sheet.
 *
 * Per Rito (29 Jul): no LTV messaging on this page — LTV leads on gold only.
 * The worked example is deliberately rate-led and unfilled until compliance
 * confirms a figure.
 *
 * After editing, run:  node scripts/build-asset-pages.mjs fine-art
 */
export default {
  slug: 'fine-art',
  noun: { singular: 'artwork', plural: 'fine art' },

  meta: {
    title: 'Art Finance & Loans Against Fine Art in London | Trinity Pawnbrokers',
    description: 'Loans against fine art — paintings, prints, sculpture and collections. Valued by art specialists on provenance and market, competitive rates, no credit checks, discreet and fully insured. Your work returned exactly as you left it. FCA regulated.',
  },

  hero: {
    image: { src: 'images/v2/art.jpg', alt: 'A framed painting lit in a gallery' },
    eyebrow: 'Art finance · Loans against fine art · City of London · Est. 2013',
    heading: 'Borrow against your <span>art</span>. <em>Keep the work</em>, and take it back when you repay.',
    intro: 'Trinity lends against fine art — paintings, prints, sculpture and whole collections — through our specialist art-finance division. Discreet loans from £500 with no maximum, valued by art specialists on provenance and the market, insured and handled with care, and your work returned exactly as you left it when you repay.',
    ctaPrimary: { label: 'Value my artwork', href: '#value-form' },
    ctaGhost: { label: 'How a loan against art works', href: '#how' },
    reassurance: 'No credit checks. Nothing on your credit file. Discreet, specialist handling.',
  },

  form: {
    heading: 'What is your artwork worth as a loan?',
    intro: 'Tell us the artist, the work and its provenance, and send a few photos. An art specialist reviews it against recent market results and comes back with an indicative offer — discreetly, and with no obligation.',
    stepLabels: {
      1: 'Step 1 of 2 · Your artwork',
      2: 'Step 2 of 2 · Where to send your offer',
    },
    fields: [
      [
        { id: 'wf-type', label: 'Type of work', type: 'select', options: ['Painting', 'Print / Edition', 'Drawing', 'Sculpture', 'Collection', 'Other'] },
        { id: 'wf-artist', label: 'Artist / maker', optional: true, type: 'text', placeholder: 'helpful, if you know it' },
      ],
      [
        { id: 'wf-title', label: 'Title or subject', optional: true, type: 'text', placeholder: 'e.g. Untitled, 1998' },
        { id: 'wf-size', label: 'Approximate size', optional: true, type: 'text', placeholder: 'e.g. 60 × 80cm' },
      ],
      [
        { id: 'wf-provenance', label: 'Provenance &amp; papers', optional: true, type: 'text', placeholder: 'certificate of authenticity, receipts, exhibition history' },
      ],
    ],
    photos: { label: 'Add photos', hint: 'The full work, the signature or edition mark, and any labels on the reverse' },
    continueLabel: 'Continue',
    submitLabel: 'Get my indicative offer',
    backLabel: '← Back to your artwork',
    noteStep1: 'Free, no obligation, same-day offer, and nothing recorded on your credit file.',
    noteStep2: 'Free, no obligation, and nothing recorded on your credit file. Nothing moves until you have an offer you’re happy with, and everything is handled discreetly.',
  },

  trust: [
    { text: '£60m+ lent since 2013', chip: 'Confirm' },
    { text: 'Specialist art-finance division' },
    { text: 'Valued on provenance &amp; market' },
    { text: 'FCA regulated, ref 741896' },
    { text: 'Fully insured, discreet handling', highlight: true },
  ],

  lendAgainst: {
    eyebrow: 'What we lend against',
    heading: 'The art we lend against',
    intro: 'We lend against work worth keeping — from a single painting to a whole collection. Provenance and paperwork help the valuation, but our specialists can assess a work on its own merit.',
    cards: [
      { icon: 'ph-paint-brush', title: 'Modern &amp; contemporary',
        body: 'Blue-chip and established contemporary names, valued against recent auction and private-sale results.' },
      { icon: 'ph-stack', title: 'Prints &amp; editions',
        body: 'Signed and numbered editions by sought-after artists, valued on edition, condition and demand.' },
      { icon: 'ph-bank', title: 'Old Masters &amp; period works',
        body: 'Earlier paintings and works on paper, assessed for attribution, condition and provenance.' },
      { icon: 'ph-cube', title: 'Sculpture &amp; collections',
        body: 'Three-dimensional works and grouped holdings, including dealer and gallery inventory used as working capital.' },
    ],
  },

  borrow: {
    eyebrow: 'How much you can borrow',
    heading: 'Valued on provenance and the market',
    intro: 'Your work is valued by an art specialist — the artist, the piece, its provenance and condition — against recent auction and private-sale results for comparable work. That means an accurate valuation and a competitive loan, at transparent rates. Loans start at £500 and, for significant works and collections, run well into six and seven figures.',
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
      statement: 'Borrow £[X,XXX] against a contemporary painting for [X] months — a rate-led worked example goes here once compliance confirms the figure.',
      rows: [
        { label: 'Amount borrowed', value: '£[X,XXX]' },
        { label: 'Term', value: '[X] months' },
        { label: 'Interest', value: '£[XXX]' },
        { label: 'Total to repay', value: '£[X,XXX]' },
        { label: 'Representative APR', value: '[XX.X]%', total: true },
      ],
      note: 'Indicative only. Your offer depends on the specific work, its provenance and condition, and the market on the day.',
    },
  },

  how: {
    eyebrow: 'How it works',
    heading: 'Four steps. The work back with you at the end.',
    steps: [
      { icon: 'ph-chat-teardrop-text', title: 'Tell us about the work',
        body: 'Send the artist, provenance and a few photos. A specialist values it and sends an indicative offer, discreetly.' },
      { icon: 'ph-truck', title: 'We arrange specialist handling <span class="confirm-chip">Art division logistics</span>',
        body: 'For fine art we arrange specialist fine-art transport and insurance to the work’s value, or a specialist can view the piece in situ where that’s more appropriate. Art is never sent by ordinary post. It’s insured throughout.' },
      { icon: 'ph-hand-coins', title: 'Accept the offer and get paid',
        body: 'Once the work has been examined and the valuation confirmed, accept and the money follows quickly. <span class="confirm-chip">Funding timeline for art</span>' },
      { icon: 'ph-paint-brush', title: 'Repay, and the work comes back to you',
        body: 'Loans run for six months and can be extended. Repay early and you pay less, with no penalty. Your work is returned exactly as you left it.' },
    ],
    link: { label: 'Read the process in full, including what happens at the end of the term →', href: '#' },
  },

  valuation: {
    eyebrow: 'How we value fine art',
    heading: 'Valued by art specialists, on provenance and the market',
    intro: 'Every work is assessed by an art specialist — the artist and attribution, provenance and exhibition history, condition, and comparable auction and private-sale results. We come from the galleries and the auction houses, and we value a work as the art market would, not as a generalist would.',
    points: [
      { icon: 'ph-signature', title: 'Artist and attribution established', body: 'Including the edition, where the work is one of a series.' },
      { icon: 'ph-scroll', title: 'Provenance and paperwork weighed', body: 'Receipts, catalogues and exhibition history read and counted.' },
      { icon: 'ph-magnifying-glass', title: 'Condition assessed by specialists', body: 'Examined properly, not judged from a photograph.' },
      { icon: 'ph-chart-line-up', title: 'Valued against comparables', body: 'Recent auction and private-sale results for comparable work.' },
    ],
  },

  why: {
    eyebrow: 'Why Trinity rather than selling or consigning',
    heading: 'A loan against your <span>art</span> — not a sale, not a consignment.',
    intro: 'Selling at auction or to a dealer means giving up the work, waiting for the right sale, and paying a commission. A loan against it means you keep ownership, release the value now, and take the work back when you repay. That difference is the whole point.',
    rows: [
      { icon: 'ph-paint-brush', label: 'Your work', trinity: 'Keep the work — it’s a loan, not a sale or a consignment', highStreet: 'Sold or consigned, and gone' },
      { icon: 'ph-percent', label: 'Rates', trinity: 'Transparent rates', trinityChip: 'Needs substantiated APR', highStreet: 'Commission on every sale' },
      { icon: 'ph-scales', label: 'Valuation', trinity: 'Valued by art specialists on provenance and the market', highStreet: 'Valued by a generalist' },
      { icon: 'ph-vault', label: 'Handling', trinity: 'Discreet, fully insured specialist handling and storage', highStreet: 'Crated, shipped and shown' },
      { icon: 'ph-identification-card', label: 'Credit file', trinity: 'No credit checks, and nothing recorded on your credit file', highStreet: 'May run credit checks' },
      { icon: 'ph-clock-countdown', label: 'Redemption', trinity: 'No early-repayment penalty — redeem the moment you’re ready', highStreet: 'Wait for the right sale' },
    ],
  },

  proof: {
    reviewsNote: '400+ five-star reviews of Unbolted, the FCA-regulated lender behind every Trinity loan.',
    caseStudy: {
      label: 'Case study · Redeemed <span class="confirm-chip">Awaiting a consented case</span>',
      statement: '[Art case study to be supplied — the work described rather than pictured, the sum lent, the timeline, redeemed. Discretion preserved.]',
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
    eyebrow: 'Fine art FAQs',
    heading: 'Asked, answered',
    items: [
      { q: 'Do I have to sell my art?', a: 'No. This is a loan against the work. You keep ownership throughout and take it back when you repay — no sale, no consignment.' },
      { q: 'Do I need provenance or a certificate of authenticity?', a: 'It helps, and for higher-value works it may be needed to confirm attribution — but our specialists can assess many works on their own merit. Tell us what you have.' },
      { q: 'How is the artwork transported and kept safe?', a: 'By specialist fine-art transport, insured to the work’s value — or a specialist can view it where it hangs. It’s stored in secure, insured, climate-appropriate conditions, never displayed or sold, and returned exactly as you left it. <span class="confirm-chip">Art division transport, storage and insurance</span>' },
      { q: 'Can dealers and galleries borrow against stock?', a: 'Yes. Inventory can be used as collateral for working capital or to bridge a sale, and redeemed the moment a piece sells, with no early-repayment penalty.' },
      { q: 'What if I cannot repay?', a: 'Talk to us. Loans can usually be extended. If a loan is not repaid, the work may be sold, and anything it makes above what you owe comes back to you.' },
      { q: 'Will this affect my credit file?', a: 'No. There is no credit check and nothing is recorded.' },
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
    heading: 'Find out what your art is worth as a loan',
    intro: 'A confidential valuation, at no cost, with no obligation to proceed.',
    cta: { label: 'Value my artwork', href: '#value-form' },
    contactPrefix: 'Or speak to a specialist:',
    contactSuffix: '· WhatsApp',
  },

  specimenBar: 'Asset template · Fine art · client first-draft copy · rate/APR and figures pending compliance',
};
