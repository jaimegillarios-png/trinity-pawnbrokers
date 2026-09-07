import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy .env.example to .env in studio/ and fill it in.',
  );
}

/**
 * One document each, opened directly from the nav and keyed by a fixed `_id`.
 * A second copy of any of these would not render anywhere — the site queries
 * `*[_type == "…"][0]` — so duplicate and delete are taken away rather than
 * left to surprise someone.
 */
const SINGLETONS = [
  'siteSettings',
  'homePage',
  'lendPage',
  'howPage',
  'aboutPage',
  'faqPage',
  'contactPage',
  'shopPage',
  'blogIndex',
];

export default defineConfig({
  name: 'trinity',
  title: 'Trinity Pawnbrokers',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Singletons should not be creatable or deletable from the global menus.
    templates: (prev) => prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : prev,
  },
});
