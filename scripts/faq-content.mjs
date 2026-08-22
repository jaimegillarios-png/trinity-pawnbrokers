/**
 * The FAQ, taken from the pawnbroking FAQ Open Access Finance Ltd publishes as
 * Unbolted. Same firm, same FCA permission, same operation — so these are the
 * answers that apply to a Trinity loan.
 *
 * Source: https://unbolted.com/pawn/how-it-works/your-questions/
 *
 * Answers are lightly edited for house voice and for the Trinity name; the
 * substance — figures, timings, procedures — is carried across unchanged. Two
 * things need checking before launch: the £25,000 standard insurance cover,
 * and the underwriter, which the source still names as XL Catlin (now AXA XL).
 * Nothing here has had compliance sign-off.
 */
export const FAQ_GROUPS = [
  {
    title: 'The loan',
    items: [
      {
        q: 'I have not done this before. How does it work?',
        a: 'We establish an open market resale value for your item, working with industry specialists and auction houses to arrive at it. We then offer you up to 80% of that value as a loan.',
      },
      {
        q: 'How much can I borrow, and for how long?',
        a: 'From £500, with no maximum. The standard term is six months. You can apply to extend for one further term by paying off the accrued interest, the set-up fee, and any depreciation in the value of the item.',
      },
      {
        q: 'Do you run a credit check?',
        a: 'No. This is a private loan against a personal asset. We verify your identity electronically — and if that fails, by asking for copies of documents — to comply with anti-money laundering rules and to reduce fraud risk. For higher value loans we may ask for a High Net Worth certificate from your accountant.',
      },
      {
        q: 'What happens if I cannot repay or extend?',
        a: 'We sell the pledged item to recover what is owed under the loan. Any surplus, after the loan and the costs of sale are settled, is returned to you by bank transfer. We do not report the default to any credit agency.',
      },
      {
        q: 'How do you protect my privacy?',
        a: 'Lenders see only a summary of the assets they are lending against. We take care not to publish anything that could identify a borrower, and we never share images with them. If you have a specific concern, tell us and we will do our best to accommodate it.',
      },
    ],
  },
  {
    title: 'Getting the money',
    items: [
      {
        q: 'How quickly can I have an offer?',
        a: 'For most items we can value in house, within three hours of your item reaching us. We would rather be meticulous than fast, so a piece that needs an outside opinion takes longer.',
      },
      {
        q: 'How quickly can I have the money?',
        a: 'Within one working hour of you signing the credit agreement, provided your bank is on the Faster Payments network.',
      },
      {
        q: 'How will I receive it?',
        a: 'By transfer to a UK bank account in your own name. We verify that the account belongs to you, electronically where we can and otherwise by asking for a statement. To comply with anti-money laundering procedures we will not transfer to any other account.',
      },
      {
        q: 'How do I repay?',
        a: 'By bank transfer, quoting your loan reference number so we can allocate the funds. Loans cannot be repaid by credit, charge or debit card.',
      },
      {
        q: 'How do I extend?',
        a: 'Request an extension online once you have repaid the outstanding interest and charges, including the set-up fee added to your loan. We treat the request as a new loan: our valuers consider whether the item has materially depreciated, and if it has, you pay the difference.',
      },
    ],
  },
  {
    title: 'Valuation',
    items: [
      {
        q: 'What does the valuation reflect?',
        a: 'A percentage of the realisable secondary market value, judged by a specialist in that category. It will be different from what you paid, and different from any insurance valuation you hold — both are usually higher.',
      },
      {
        q: 'Do I pay for the valuation?',
        a: 'No. The valuation is free and there is nothing to pay if you decide not to go ahead. If you do take the loan, a set-up fee is payable upfront and covers the valuation costs.',
      },
      {
        q: 'How quickly is a final valuation confirmed?',
        a: 'In most cases within four working hours of your item arriving. It takes longer if we want a second opinion from an outside specialist.',
      },
      {
        q: 'Could my final valuation come in lower?',
        a: 'Only if the description you gave us, or the photographs you uploaded, missed a fact, defect or feature that affects the value. Otherwise, no.',
      },
      {
        q: 'Will you issue a valuation certificate?',
        a: 'No. Our valuations exist solely to establish what your item is worth as security for the loan.',
      },
      {
        q: 'Why will you not simply accept my insurance valuation?',
        a: 'We will take any information you give us into account. But our specialists always assess the item independently, using their own expertise and current market data.',
      },
    ],
  },
  {
    title: 'Sending your item',
    items: [
      {
        q: 'How do I get my item to you?',
        a: 'Small items — gold, watches, jewellery — travel by Royal Mail Special Delivery on a free QR code label we email you, fully insured. For larger or more fragile items we work with specialist logistics companies; ask us and we will arrange it.',
      },
      {
        q: 'Is it safe to send something valuable by courier?',
        a: 'Yes. Pack it securely and take it to your nearest Post Office. The parcel is tracked all the way until it is signed for by us and opened on camera. Everything in transit is fully insured, at no cost to you.',
      },
      {
        q: 'How much is the insurance cover?',
        a: 'Items sent through Royal Mail are insured up to the full indicative valuation, or the final valuation once that is agreed. Standard cover runs to £25,000; we can arrange more for a more valuable item — ask before you send it.',
      },
      {
        q: 'What can I send by courier?',
        a: 'Almost anything, so long as the package is not too large or heavy and the item is properly packed. For large or heavy items, contact us and we will arrange transport through a specialist.',
      },
      {
        q: 'How should I pack it?',
        a: 'Use a rigid box. Wrap each item separately with adequate cushioning — as a rule of thumb, at least two inches of packaging between the item and the outer walls, using bubble wrap or foam sheets. Then tape it well.',
      },
      {
        q: 'Can I be valued in person?',
        a: 'Where possible, our valuer will meet you at your appointment and give you a valuation while you are there. It is not always possible — some items need more time, and logistics sometimes get in the way.',
      },
      {
        q: 'Where is my item kept?',
        a: 'On site, or at a partner’s secured facility. It is insured the whole time we hold it.',
      },
      {
        q: 'How do I get it back?',
        a: 'In most cases by free, fully insured courier. If it has been held at our office you are welcome to collect it, by appointment.',
      },
    ],
  },
];
