import { createClient, type ClientConfig } from '@sanity/client';

/**
 * Credentials come from the environment, never the repo. Copy .env.example to
 * .env and fill it in from your Sanity project settings.
 */
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const token = import.meta.env.SANITY_API_READ_TOKEN;

export const sanityConfigured = Boolean(projectId);

const config: ClientConfig = {
  projectId: projectId ?? 'missing',
  dataset,
  // Pinned. An unpinned API version means Sanity can change response shapes
  // under a build that used to pass.
  apiVersion: '2026-01-01',
  // The site is prerendered, so every query runs at build time and the CDN
  // would only ever serve us staler content than the build deserves.
  useCdn: false,
  ...(token ? { token, perspective: 'previewDrafts' as const } : {}),
};

export const sanity = createClient(config);

/**
 * Query wrapper that fails loudly at build time. A marketing page that renders
 * with silently missing content is worse than a build that stops.
 */
export async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanityConfigured) {
    throw new Error(
      'Sanity is not configured. Set PUBLIC_SANITY_PROJECT_ID in .env — see .env.example.',
    );
  }
  return sanity.fetch<T>(groq, params);
}
