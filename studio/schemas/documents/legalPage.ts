import { defineField, defineType } from 'sanity';

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  description: 'Privacy, terms, cookies, complaints procedure.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      description: 'Shown on the page. Regulated policies should say when they last changed.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Sub-heading', value: 'h3' }] },
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', type: 'seo', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
