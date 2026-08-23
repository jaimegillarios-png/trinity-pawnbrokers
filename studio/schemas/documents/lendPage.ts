import { defineArrayMember, defineField, defineType } from 'sanity';

export const lendPage = defineType({
  name: 'lendPage',
  title: 'What we lend against',
  type: 'document',
  description:
    'The hub the main nav points at. The seven categories are pulled from the item pages themselves, so nothing here needs updating when one changes — this document is only the copy around them.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'intro', type: 'sectionIntro', group: 'content' }),
    defineField({
      name: 'criteria',
      title: 'What makes something lendable',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'other',
      title: 'Anything else',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'body', type: 'text', rows: 3 }),
        defineField({ name: 'cta', type: 'cta' }),
      ],
    }),
    defineField({ name: 'closing', type: 'closingSection', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'What we lend against' }) },
});
