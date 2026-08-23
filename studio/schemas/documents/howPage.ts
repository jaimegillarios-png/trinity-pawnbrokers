import { defineArrayMember, defineField, defineType } from 'sanity';

export const howPage = defineType({
  name: 'howPage',
  title: 'How it works',
  type: 'document',
  groups: [
    { name: 'steps', title: 'The steps', default: true },
    { name: 'detail', title: 'Detail' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'intro', type: 'sectionIntro', group: 'steps' }),
    defineField({
      name: 'steps',
      type: 'array',
      of: [defineArrayMember({ type: 'howStep' })],
      group: 'steps',
      validation: (r) => r.required().min(1),
    }),

    defineField({
      name: 'terms',
      title: 'The terms',
      description: 'The figures, in one table. Anything stated here should agree with the FAQs.',
      type: 'object',
      group: 'detail',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'rows', type: 'array', of: [defineArrayMember({ type: 'specRow' })] }),
        defineField({ name: 'note', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'sending',
      title: 'Getting your item to us',
      type: 'object',
      group: 'detail',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'ending',
      title: 'At the end of the term',
      type: 'object',
      group: 'detail',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'custody',
      title: 'Who holds it, who funds it',
      type: 'object',
      group: 'detail',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'statement', type: 'text', rows: 3, description: 'Wrap a phrase in *asterisks* for gold.' }),
        defineField({ name: 'note', type: 'text', rows: 3 }),
        defineField({ name: 'cta', type: 'cta' }),
      ],
    }),

    defineField({ name: 'closing', type: 'closingSection', group: 'detail' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'How it works' }) },
});
