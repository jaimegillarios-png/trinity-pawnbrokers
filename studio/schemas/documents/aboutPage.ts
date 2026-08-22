import { defineArrayMember, defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'why', title: 'Why Trinity exists' },
    { name: 'oneFirm', title: 'Trinity & Unbolted' },
    { name: 'bench', title: 'The bench' },
    { name: 'principles', title: 'What we hold to' },
    { name: 'closing', title: 'Closing' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'hero', type: 'heroSection', group: 'hero', validation: (r) => r.required() }),
    defineField({
      name: 'record',
      title: 'The record',
      description:
        'The plaque beside the headline — the establishment facts, four or five rows at most. Anything longer stops reading as a plaque.',
      type: 'array',
      of: [defineArrayMember({ type: 'specRow' })],
      group: 'hero',
      validation: (r) => r.max(5).warning('The plaque is drawn for up to five rows.'),
    }),
    defineField({
      name: 'why',
      title: 'Why Trinity exists',
      type: 'object',
      group: 'why',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'paragraphs',
          title: 'Body',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 4 })],
          description: 'One entry per paragraph. Wrap a phrase in *asterisks* to set it in gold.',
        }),
      ],
    }),

    defineField({
      name: 'oneFirm',
      title: 'Trinity & Unbolted',
      description:
        'The green band that explains the two names. This is the single thing customers ask about most, so it says the same thing as the homepage custody band, at more length.',
      type: 'object',
      group: 'oneFirm',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({
          name: 'statement',
          type: 'text',
          rows: 3,
          description: 'Wrap a phrase in *asterisks* to set it in gold.',
        }),
        defineField({ name: 'note', type: 'text', rows: 4 }),
        defineField({ name: 'cta', type: 'cta' }),
      ],
    }),

    defineField({
      name: 'bench',
      title: 'The bench',
      type: 'object',
      group: 'bench',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'disciplines',
          type: 'array',
          of: [defineArrayMember({ type: 'iconCard' })],
        }),
      ],
    }),

    defineField({
      name: 'principles',
      title: 'What we hold to',
      type: 'object',
      group: 'principles',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'items',
          type: 'array',
          of: [defineArrayMember({ type: 'iconCard' })],
        }),
      ],
    }),

    defineField({ name: 'closing', type: 'closingSection', group: 'closing' }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
});
