import { defineArrayMember, defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'visit', title: 'Visit' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'intro', type: 'sectionIntro', group: 'content' }),
    defineField({
      name: 'channels',
      title: 'Ways to get in touch',
      description:
        'One block each for phone, email and the office. The link is what the block heading points at — a tel:, a mailto: or a map.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactChannel',
          fields: [
            defineField({ name: 'icon', type: 'string', description: 'A Phosphor icon class, e.g. ph-phone.' }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'href', type: 'string' }),
            defineField({ name: 'note', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'elsewhere',
      title: 'Pointers',
      description: 'Short lines sending people somewhere better than the phone — a valuation, the complaints procedure.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pointer',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 2 }),
            defineField({ name: 'cta', type: 'cta' }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),

    defineField({ name: 'visitIntro', title: 'Opener', type: 'sectionIntro', group: 'visit' }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      group: 'visit',
      description: 'The src of a Google Maps embed. Leave empty to drop the map.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Contact page' }) },
});
