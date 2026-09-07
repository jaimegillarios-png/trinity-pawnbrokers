import { defineField, defineType } from 'sanity';

export const shopPage = defineType({
  name: 'shopPage',
  title: 'Shop',
  type: 'document',
  description: 'The shop’s own front page, and the copy shared across the shop.',
  groups: [
    { name: 'home', title: 'Shop home', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    /* The shop opens like a shop, not like a section of the marketing site —
       a hero, then the pieces. It reuses the same hero object as the item
       pages so the two stay visually related. */
    defineField({ name: 'hero', type: 'heroSection', group: 'home' }),
    defineField({
      name: 'featured',
      title: 'Featured watches opener',
      type: 'sectionIntro',
      group: 'home',
      description: 'Sits above the three pieces picked out on the shop home.',
    }),
    defineField({ name: 'intro', type: 'sectionIntro', group: 'home' }),
    defineField({
      name: 'story',
      title: 'About the shop',
      type: 'object',
      group: 'home',
      description: 'Shown on the shop home and on /shop/about.',
      fields: [
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
        defineField({
          name: 'image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'assurances',
      title: 'What every piece comes with',
      type: 'array',
      of: [{ type: 'iconCard' }],
      group: 'home',
    }),
    defineField({ name: 'closing', type: 'closingSection', group: 'home' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Shop' }) },
});
