import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/shop/env';
import { stripeFor, verifyWebhook } from '../../lib/shop/stripe';
import { markSold, release } from '../../lib/shop/stock';

export const prerender = false;

/**
 * Stripe tells us what happened; the browser never does.
 *
 * The success page is a courtesy — a buyer can close the tab the moment they
 * pay, and a hostile one can open the success URL without paying at all. This
 * route is the only thing that marks a piece sold, and it only acts on a
 * payload carrying a valid signature.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = readEnv(locals);
  const signature = request.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event;
  try {
    // Verified against the raw body — parsing first would re-serialise it and
    // break the signature.
    event = await verifyWebhook(env, await request.text(), signature);
  } catch (error) {
    console.error('webhook signature rejected', error);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        /* The event body is rendered in whatever API version the account or
           the endpoint is pinned to, which may be far older than the one this
           code was written against — old enough that `payment_status` does not
           exist in the payload at all, in which case a real payment would look
           unpaid and the piece would never be marked sold.
           
           So the event is used only for the session id, and the state is read
           back through our own pinned client. One extra call, and the handler
           stops depending on a setting in someone else's dashboard. */
        const id = event.data.object.id;
        const session = await stripeFor(env).checkout.sessions.retrieve(id);
        /* Cards settle inside the session; bank debits do not. An unpaid
           session keeps its hold and waits for the async event below, so the
           piece is neither sold early nor released while money is in flight. */
        if (session.payment_status === 'paid') await markSold(env, id);
        break;
      }

      case 'checkout.session.async_payment_succeeded':
        await markSold(env, event.data.object.id);
        break;

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        await release(env, event.data.object.id);
        break;
    }
  } catch (error) {
    /* A non-2xx makes Stripe retry, which is what we want: better a duplicate
       delivery — both `markSold` and `release` are safe to repeat — than a
       watch left held or sold to nobody. */
    console.error(`webhook ${event.type} failed`, error);
    return new Response('Handler failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
};
