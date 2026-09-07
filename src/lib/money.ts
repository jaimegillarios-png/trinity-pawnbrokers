/**
 * Prices are stored in pence because that is what Stripe charges in — keeping
 * one unit end to end means no rounding decision is ever made twice.
 */
export function money(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    // Watches are whole pounds. A stray ".00" on every price is noise.
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(pence / 100);
}
