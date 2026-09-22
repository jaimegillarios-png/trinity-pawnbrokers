import { defineField, defineType } from 'sanity';

/** The /guides page: its heading, its introduction, and how it appears in search. */
export const guidesIndex = defineType({
  name: 'guidesIndex',
  title: 'Guides page',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'standfirst', type: 'text', rows: 3 }),
    defineField({ name: 'seo', type: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Guides page' }) },
});
