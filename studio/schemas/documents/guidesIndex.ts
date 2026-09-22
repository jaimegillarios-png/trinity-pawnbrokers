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
    defineField({
      name: 'closing',
      title: 'Closing band',
      type: 'closingSection',
      description: 'The dark band above the footer, on this page and on every guide that does not set its own.',
    }),
    defineField({ name: 'seo', type: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Guides page' }) },
});
