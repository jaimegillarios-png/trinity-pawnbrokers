import { defineArrayMember, defineField, defineType } from 'sanity';

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'intro', type: 'sectionIntro', group: 'content' }),
    defineField({
      name: 'groups',
      title: 'Question groups',
      description:
        'Each group becomes its own accordion. Every question on the page is published as FAQ structured data, so they can appear directly in Google — which is the main reason this page earns its keep.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqGroup',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'items',
              type: 'array',
              of: [defineArrayMember({ type: 'faqItem' })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: { select: { title: 'title', items: 'items' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'closing', type: 'closingSection', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'FAQ page' }) },
});
