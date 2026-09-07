import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/shop/env';
import { stripeFor } from '../../lib/shop/stripe';

/* An API route rather than a server-rendered page, for a platform reason
   rather than a design one: on deployed Cloudflare Pages the Astro adapter's
   streamed HTML response arrives as the string "[object Object]", while a
   route returning a plain body works. Every page on this site is therefore
   prerendered, and the confirmation page asks this for its order. */
export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const GET: APIRoute = async ({ url, locals }) => {
  const id = url.searchParams.get('session_id');
  /* The id is the only credential here — long, random, and known only to the
     person Stripe just redirected. Same trust model as the page it replaced. */
  if (!id || !id.startsWith('cs_')) return json({ state: 'unknown' }, 400);

  const env = readEnv(locals);
  if (!env.STRIPE_SECRET_KEY) {
    console.error('order lookup disabled: STRIPE_SECRET_KEY is not set');
    return json({ state: 'unknown' }, 503);
  }

  try {
    const session = await stripeFor(env).checkout.sessions.retrieve(id, {
      expand: ['line_items'],
    });
    return json({
      state: session.payment_status === 'paid' ? 'paid' : 'pending',
      // Short enough to read down a phone line, and what staff search Stripe for.
      reference: id.slice(-8).toUpperCase(),
      total: session.amount_total ?? 0,
      email: session.customer_details?.email ?? null,
      lines: (session.line_items?.data ?? []).map((item) => ({
        name: item.description ?? 'Item',
        amount: item.amount_total,
      })),
    });
  } catch (error) {
    console.error('could not retrieve session', error);
    return json({ state: 'unknown' }, 404);
  }
};
