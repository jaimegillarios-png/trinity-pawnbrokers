/**
 * The two pages the shop cannot legally take money without.
 *
 * These are written differently from the placeholder pages. A cookie policy
 * that says "not finished" is honest; a returns policy that says the same
 * would be worse than useless, because the statutory half of it is true no
 * matter what the client decides. The Consumer Contracts Regulations 2013 give
 * a fourteen-day cancellation right whether or not anyone writes it down, and
 * the Consumer Rights Act 2015 gives a thirty-day right to reject faulty goods
 * on the same terms.
 *
 * So the law is written out in full and is ready to publish. What only the
 * client can answer — carrier, cost, timescale, VAT treatment, warranty, where
 * a return is posted — is marked [TO CONFIRM: …] so it is impossible to
 * publish by accident and obvious what is being asked for.
 *
 * Cross-check before launch: whoever signs these off should confirm the
 * second-hand margin scheme treatment with the firm's accountant, because it
 * changes whether a VAT invoice can be issued at all.
 */

export const SHIPPING = `We only sell pieces we have in our own strongroom, so there is one of everything and it goes out the way it came in: checked, photographed and insured.

## Where we deliver

We deliver to addresses in the United Kingdom. The checkout will not accept an address outside it.

[TO CONFIRM: whether international delivery is offered, and to where. If it is, the country list in the checkout and this paragraph both change.]

## How it travels

Insured to its full value and signed-for. Nothing is left with a neighbour, in a porch or in a safe place, and we will not release a delivery to an unsigned address.

[TO CONFIRM: the carrier and service, the cost, and how many working days from cleared payment. The cart and the confirmation page currently say delivery within the UK is insured and included — confirm that this is right, or tell us the charge and we will show it at checkout.]

## When it goes

We despatch once payment has cleared and the piece has passed its final check. If anything delays that, we will call you rather than let the day pass quietly.

## Changing your mind

You have the right to cancel this contract within fourteen days without giving any reason. The cancellation period ends fourteen days after the day on which you, or someone you name other than the courier, takes physical possession of the item.

To cancel, tell us plainly — by phone, by email, or in writing. A clear statement is enough; you do not have to use a particular form of words. To meet the deadline it is enough that you send your message before the cancellation period expires.

Once you have told us, send the item back without undue delay and in any event within fourteen days of that message.

[TO CONFIRM: the returns address, and whether Trinity pays return postage or the customer does. The law allows either, but it has to be stated here before the sale — if it is not stated, the cost falls on us.]

Send it back insured for its full value and signed-for. Until it reaches us it is still your responsibility, and a five-figure watch should not travel uninsured.

## Your refund

We will refund everything you paid, including the standard delivery cost, no later than fourteen days after the item comes back to us — or, if earlier, fourteen days after you show us proof that you have sent it. The refund goes back to the card you paid with, and there is no fee for it.

Where you chose a delivery service more expensive than our standard one, we refund the standard cost rather than the premium.

We may reduce your refund to reflect any loss in value caused by handling the item beyond what is necessary to establish its nature, characteristics and functioning — the sort of handling you could reasonably do in a shop. Trying a watch on is fine. Sizing the bracelet, wearing it out, or removing protective film is not.

## If something is wrong with it

Everything is sold used unless we say otherwise, and the condition report on each item is part of its description. That description is the standard the piece has to meet.

If what arrives is faulty or not as described, you have thirty days from delivery to reject it and get a full refund. After that, and for the first six months, you can ask us to repair or replace it; if that is not possible, you are entitled to a refund. These rights are in addition to the fourteen-day cancellation right above, and nothing on this page affects them.

## Authenticity

Every piece is examined and authenticated before it is listed. If an item is ever shown not to be what we said it was, we will take it back and refund it in full, whenever that comes to light.

[TO CONFIRM: whether Trinity offers a warranty on movements, for how long, and who honours it — us or a third-party servicing partner.]

## Talking to us

Call [PHONE] or email [EMAIL]. If we cannot put something right, our [complaints procedure](/complaints) explains what happens next.`;

export const TERMS_OF_SALE = `These terms cover buying a piece from the Trinity shop. They are not the terms of a pawnbroking loan — a purchase is an ordinary sale of goods, there is no credit and no regulated agreement, and nothing you buy here is redeemable.

## Who you are buying from

Open Access Finance Ltd, trading as Trinity Pawnbrokers, of Token House, 11–12 Token House Yard, London EC2R 7AS. Authorised and regulated by the Financial Conduct Authority under reference 741896.

[TO CONFIRM: company registration number and registered office, and the VAT number if the shop is registered.]

## The item

Every piece is unique and second-hand unless its description says otherwise. Photographs are of the actual item, not a stock image. We describe condition as accurately as we can, including the marks a used piece carries; where a description and a photograph disagree, tell us and we will resolve it before you buy.

## Price and VAT

Prices are in pounds sterling and are what you pay. There are no fees added at checkout.

[TO CONFIRM: VAT treatment. Second-hand goods of this kind are usually sold under the VAT margin scheme, which means VAT is not shown separately and a VAT invoice cannot be issued. Confirm this with your accountant — it changes what this paragraph and every receipt must say.]

## How the contract is made

Placing an order is an offer to buy. Because each piece is one of a kind, the contract is only made when we email you to confirm despatch — not when you pay.

If, between your payment and that confirmation, we find the piece has already sold, or that its price was displayed wrongly, we will tell you and refund you in full straight away. We will not quietly substitute something else.

## Paying

Payment is taken by Stripe. Your card details go to Stripe, not to us, and we never see or store them.

While you are on the payment page the piece is held for you for thirty minutes so nobody else can buy it. If the payment is not completed in that time the hold lapses and the item goes back on sale.

## Delivery, risk and ownership

Delivery is covered on the [shipping and returns](/shipping-and-returns) page, which forms part of these terms.

The item is at our risk until it is delivered to the address you gave us. Ownership passes to you when we have received payment in full.

## Cancelling and returning

Your fourteen-day right to cancel, how to return an item, and how refunds are paid are all set out on the [shipping and returns](/shipping-and-returns) page.

## If we get it wrong

We are responsible for loss you suffer that is a foreseeable result of us breaking these terms or failing to use reasonable care. We are not responsible for loss that was not foreseeable, or for business losses — these terms are for consumers buying for private use.

Nothing here limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else the law does not allow us to limit.

## Complaints

Tell us and we will look into it. Our [complaints procedure](/complaints) sets out the timescales and what to do if you are not satisfied with our answer.

## Governing law

These terms are governed by the law of England and Wales, and you can bring proceedings in the courts of England and Wales. If you live in Scotland or Northern Ireland you may also bring proceedings there.`;
