import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/shop/env';
import { stripeFor } from '../../lib/shop/stripe';
import { HOLD_MINUTES, fetchForCheckout, hold, isBuyable } from '../../lib/shop/stock';

/* The one route on this site that runs on the server. Everything else is
   prerendered; see the note in astro.config.mjs. */
export const prerender = false;

/** A basket of unique pieces. More than this and it is a phone call, not a
 *  checkout — and it caps what a script can make us do per request. */
const MAX_ITEMS = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const POST: APIRoute = async ({ request, locals, url }) => {
  const env = readEnv(locals);

  let slugs: string[];
  try {
    const body = (await request.json()) as { slugs?: unknown };
    if (!Array.isArray(body.slugs)) throw new Error('slugs must be an array');
    // Deduplicated: the cart holds one of each, but nothing stops a crafted
    // request asking for the same watch twice, and there is only ever one.
    slugs = [...new Set(body.slugs.filter((s): s is string => typeof s === 'string' && !!s))];
  } catch {
    return json({ error: 'Could not read that basket.' }, 400);
  }

  if (!slugs.length) return json({ error: 'There is nothing in your cart.' }, 400);
  if (slugs.length > MAX_ITEMS) {
    return json({ error: `Please checkout up to ${MAX_ITEMS} pieces at a time.` }, 400);
  }

  /* Checked after the basket is read, so a malformed request still gets a
     straight answer, and before Stripe is touched, because a session we cannot
     back with a hold is a payable page for a watch nothing is stopping someone
     else from buying at the same time. */
  for (const key of ['STRIPE_SECRET_KEY', 'SANITY_API_WRITE_TOKEN']) {
    if (!env[key]) {
      console.error(`checkout disabled: ${key} is not set`);
      return json({ error: 'Card payment is temporarily unavailable. Please call us.' }, 503);
    }
  }

  try {
    /* Prices come from Sanity, never from the browser. The cart stores slugs
       precisely so that a tampered price cannot reach Stripe. */
    const items = await fetchForCheckout(env, slugs);

    const missing = slugs.filter((s) => !items.some((i) => i.slug === s));
    const taken = items.filter((i) => !isBuyable(i));
    if (missing.length || taken.length) {
      return json(
        {
          error: 'Some of these are no longer available.',
          unavailable: [...missing, ...taken.map((i) => i.slug)],
        },
        409,
      );
    }

    const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60_000);
    const stripe = stripeFor(env);
    const origin = env.SITE_URL || url.origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'gbp',
      line_items: items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: item.price,
          product_data: {
            name: `${item.brand} ${item.title}`,
            // Stripe rejects relative URLs, and rejects the whole session if an
            // image 404s, so only send one we know Sanity is serving.
            ...(item.image ? { images: [item.image] } : {}),
          },
        },
      })),
      // Matches the hold exactly. When the session lapses Stripe sends
      // `checkout.session.expired`, and the webhook puts the piece back on sale.
      expires_at: Math.floor(expiresAt.getTime() / 1000),
      // TODO(client): GB only until the client confirms whether they ship
      // internationally. Widening this list is the whole change.
      shipping_address_collection: { allowed_countries: ['GB'] },
      // A courier delivering a five-figure watch will want to call ahead.
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      // The webhook re-derives everything from the hold, so this is for the
      // humans reading the Stripe dashboard.
      metadata: { slugs: slugs.join(',') },
      success_url: `${origin}/shop/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cart`,
    });

    try {
      await hold(env, items, session.id, expiresAt.toISOString());
    } catch {
      /* Someone else got there between our read and our write. Expire the
         session immediately rather than leaving a payable page pointing at a
         watch that is no longer ours to sell. */
      await stripe.checkout.sessions.expire(session.id).catch(() => {});
      return json(
        { error: 'Someone else is buying one of these right now.', unavailable: slugs },
        409,
      );
    }

    return json({ url: session.url });
  } catch (error) {
    console.error('checkout failed', error);
    return json({ error: 'We could not start checkout. Please call us.' }, 500);
  }
};
