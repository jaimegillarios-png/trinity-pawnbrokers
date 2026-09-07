/// <reference types="astro/client" />

/** The environment contract. Anything the build needs is declared here. */
interface ImportMetaEnv {
  /** Sanity project ID — safe to expose, it is public by design. */
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  /** Only needed to preview unpublished drafts. Never commit it. */
  readonly SANITY_API_READ_TOKEN?: string;
  /** Canonical origin, e.g. https://trinitypawnbrokers.co.uk */
  readonly SITE_URL?: string;

  /* --- shop ---
     Read at request time, not build time: the server routes resolve these
     through lib/shop/env, which prefers the Cloudflare binding. Declared here
     so `astro dev` type-checks against a plain .env. */
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  /** Editor permission. Holds stock at checkout and marks pieces sold. */
  readonly SANITY_API_WRITE_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** The cart, attached by src/scripts/cart.js. Optional because a page may run
 *  before that module has loaded. */
interface Window {
  /** Set by the order confirmation page: true only when Stripe returned a real
   *  session, so a bad link cannot empty someone's cart. */
  __trinityOrderFound?: boolean;
  TrinityCart?: {
    read(): string[];
    add(slug: string): void;
    remove(slug: string): void;
    clear(): void;
  };
}
