import { createClient } from '@sanity/client';
import { require_, type Env } from './env';

/**
 * Stock, read and written at request time.
 *
 * The rest of the site reads Sanity at build time through `lib/sanity/client`.
 * The shop cannot: between the build and the click, someone else may have
 * bought the watch. So this is a second client — live, no CDN, published
 * perspective only, and holding a write token.
 */
function client(env: Env, write = false) {
  return createClient({
    projectId: require_(env, 'PUBLIC_SANITY_PROJECT_ID'),
    dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2026-01-01',
    useCdn: false,
    // Drafts must never price an order. A price is only real once published.
    perspective: 'published',
    // The dataset is public, so reading needs no credential. Only the three
    // functions that change stock ask for the write token — least privilege,
    // and it means a checkout can still tell a buyer an item has gone even if
    // the token is misconfigured.
    ...(write ? { token: require_(env, 'SANITY_API_WRITE_TOKEN') } : {}),
  });
}

export type StockItem = {
  _id: string;
  _rev: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  image: string | null;
  hold?: { sessionId?: string; expiresAt?: string };
};

/** How long a piece is held while someone is on Stripe's payment page. Long
 *  enough to find a card, short enough that an abandoned checkout does not
 *  take a watch off sale for the afternoon. */
export const HOLD_MINUTES = 30;

/**
 * Buyable means: staff have it marked available, and nobody else is part-way
 * through paying for it. An expired hold is not a hold — sessions are abandoned
 * far more often than they are completed, and an item whose holder never came
 * back must return to sale without anyone touching it.
 */
export function isBuyable(item: StockItem, now = Date.now()): boolean {
  if (item.status !== 'available') return false;
  const until = item.hold?.expiresAt;
  if (!until) return true;
  return Date.parse(until) <= now;
}

export async function fetchForCheckout(env: Env, slugs: string[]): Promise<StockItem[]> {
  return client(env).fetch<StockItem[]>(
    `*[_type == "product" && slug.current in $slugs]{
      _id, _rev, "slug": slug.current, title, brand, price, status, hold,
      "image": images[0].asset->url
    }`,
    { slugs },
  );
}

/**
 * Takes the hold, or takes nothing.
 *
 * Written as one transaction, and each patch is guarded by the revision we read
 * during the availability check. That closes the window between "this is
 * available" and "this is mine": if anyone else moved the document in between —
 * another buyer's hold, or staff marking it sold — the revision no longer
 * matches and the whole transaction is rejected rather than double-selling a
 * one-of-a-kind piece.
 */
export async function hold(env: Env, items: StockItem[], sessionId: string, expiresAt: string) {
  const tx = client(env, true).transaction();
  for (const item of items) {
    tx.patch(item._id, (p) =>
      p.ifRevisionId(item._rev).set({ hold: { sessionId, expiresAt } }),
    );
  }
  await tx.commit({ visibility: 'sync' });
}

/**
 * Paid. The hold is cleared at the same time as the status changes, so the
 * document never sits in a state where it is sold *and* held.
 *
 * Matched on session id rather than on the ids we think we held: the webhook is
 * the only authority on which session actually paid, and a stale retry must not
 * be able to sell an item that has since been released and bought by someone
 * else.
 */
export async function markSold(env: Env, sessionId: string): Promise<number> {
  const c = client(env, true);
  const ids = await c.fetch<string[]>(`*[_type == "product" && hold.sessionId == $sessionId]._id`, {
    sessionId,
  });
  if (!ids.length) return 0;
  const tx = c.transaction();
  for (const id of ids) tx.patch(id, { set: { status: 'sold' }, unset: ['hold'] });
  await tx.commit({ visibility: 'sync' });
  return ids.length;
}

/** Abandoned or expired. Puts the piece straight back on sale. */
export async function release(env: Env, sessionId: string): Promise<number> {
  const c = client(env, true);
  const ids = await c.fetch<string[]>(
    `*[_type == "product" && hold.sessionId == $sessionId && status == "available"]._id`,
    { sessionId },
  );
  if (!ids.length) return 0;
  const tx = c.transaction();
  for (const id of ids) tx.patch(id, { unset: ['hold'] });
  await tx.commit({ visibility: 'sync' });
  return ids.length;
}
