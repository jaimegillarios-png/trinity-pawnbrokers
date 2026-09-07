import Stripe from 'stripe';
import { require_, type Env } from './env';

/**
 * Stripe, configured for a Worker.
 *
 * The default Node HTTP client and crypto do not exist on Cloudflare, so both
 * are swapped for the platform's own fetch and SubtleCrypto. Without this the
 * route works in `astro dev` and fails only once deployed, which is the worst
 * way to find out.
 */
export function stripeFor(env: Env): Stripe {
  return new Stripe(require_(env, 'STRIPE_SECRET_KEY'), {
    apiVersion: '2026-08-26.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
    // Named so a charge can be traced back to this site in the Stripe logs.
    appInfo: { name: 'Trinity Pawnbrokers shop' },
  });
}

/** Signature verification has to be async on Workers — the sync variant needs
 *  Node's crypto. */
export async function verifyWebhook(env: Env, body: string, signature: string) {
  return stripeFor(env).webhooks.constructEventAsync(
    body,
    signature,
    require_(env, 'STRIPE_WEBHOOK_SECRET'),
    undefined,
    Stripe.createSubtleCryptoProvider(),
  );
}
