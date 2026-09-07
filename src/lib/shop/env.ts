/**
 * Secrets at request time.
 *
 * Prerendered pages read `import.meta.env` at build time. Server routes cannot:
 * on Cloudflare the bindings arrive per-request on `locals.runtime.env`, and
 * only there. So every server route resolves its secrets through this, which
 * checks the request binding first and falls back to the build environment so
 * `astro dev` works from a plain `.env`.
 */
export type Env = Record<string, string | undefined>;

export function readEnv(locals: unknown): Env {
  const runtime = (locals as { runtime?: { env?: Env } } | undefined)?.runtime?.env;
  return { ...(import.meta.env as unknown as Env), ...(runtime ?? {}) };
}

/** Throws with the name of the thing that is missing, so a misconfigured
 *  deploy fails with a sentence rather than a stack trace about `undefined`. */
export function require_(env: Env, key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(
      `${key} is not set. Add it to .env for local work, and to the Cloudflare Pages ` +
        `project as an encrypted variable for the deployed site.`,
    );
  }
  return value;
}
