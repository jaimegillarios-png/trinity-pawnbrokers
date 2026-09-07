// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

/**
 * Static-first. Every marketing page is prerendered at build time — that is
 * what gives us the Core Web Vitals and the crawlable HTML this site is being
 * rebuilt for. Content edits in Sanity fire a webhook at a Cloudflare deploy
 * hook, which rebuilds in seconds for a site this size.
 *
 * The Cloudflare adapter is configured anyway so that a single route can opt
 * into server rendering later (`export const prerender = false`) — a form
 * endpoint, or the shop, without re-architecting.
 */
export default defineConfig({
  site: process.env.SITE_URL || 'https://trinitypawnbrokers.co.uk',
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/studio'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  /* Astro defaults to 4321 and quietly walks up when it is busy, which leaves
     the launcher pointing at a port nothing is serving. Honouring PORT lets
     whoever starts the server decide, and keeps 4321 as the default when
     nobody has. */
  server: { port: Number(process.env.PORT) || 4321 },
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
