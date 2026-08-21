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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
