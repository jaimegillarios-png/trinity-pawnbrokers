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
    defineField({ name: 'intro', type: 'sectionIntro', group: 'home' }),
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
