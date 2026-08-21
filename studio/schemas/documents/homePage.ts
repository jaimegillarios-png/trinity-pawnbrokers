import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'index', title: 'Item index' },
    { name: 'how', title: 'How it works' },
    { name: 'custody', title: 'Custody' },
    { name: 'rates', title: 'Rates' },
    { name: 'visit', title: 'Visit us' },
    { name: 'press', title: 'Press' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'hero', type: 'heroSection', group: 'hero', validation: (r) => r.required() }),
    defineField({
      name: 'heroRotation',
      title: 'Additional hero frames',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', validation: (r) => r.required() })],
        }),
      ],
      description:
        'The hero cycles through these behind the headline, eight seconds each. The main hero image is the first frame, and the only one shown on a phone or under reduced motion.',
      group: 'hero',
    }),
    defineField({
      name: 'trust',
      title: 'Trust strip',
      type: 'array',
      of: [defineArrayMember({ type: 'trustItem' })],
      group: 'hero',
    }),

    defineField({ name: 'indexIntro', title: 'Opener', type: 'sectionIntro', group: 'index' }),
    defineField({
      name: 'indexOther',
      title: 'Anything else card',
      description: 'The dark card at the end of the grid.',
      type: 'object',
      group: 'index',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'body', type: 'text', rows: 2 }),
        defineField({ name: 'cta', type: 'cta' }),
      ],
    }),

    defineField({
      name: 'how',
      title: 'How it works',
      type: 'object',
      group: 'how',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'steps',
          type: 'array',
          of: [defineArrayMember({ type: 'iconCard' })],
          validation: (r) => r.max(5).warning('The connector line is drawn for five steps.'),
        }),
      ],
    }),

    defineField({
      name: 'custody',
      title: 'Custody statement',
      type: 'object',
      group: 'custody',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({
          name: 'statement',
          type: 'text',
          rows: 3,
          description: 'Wrap words in *asterisks* to set them in gold.',
        }),
        defineField({ name: 'note', type: 'text', rows: 3 }),
        defineField({ name: 'cta', type: 'cta' }),
      ],
    }),

    defineField({
      name: 'rates',
      title: 'Rates',
      type: 'object',
      group: 'rates',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'stats',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'rateStat',
              fields: [
                defineField({ name: 'label', type: 'string' }),
                defineField({ name: 'figure', type: 'string' }),
                defineField({ name: 'note', type: 'text', rows: 2 }),
                defineField({
                  name: 'gold',
                  title: 'Set the figure in gold',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
              preview: { select: { title: 'label', subtitle: 'figure' } },
            }),
          ],
          validation: (r) => r.max(3).warning('The row is a three-column grid.'),
        }),
        defineField({ name: 'footnote', type: 'text', rows: 3 }),
      ],
    }),

    defineField({
      name: 'visit',
      title: 'Visit us',
      type: 'object',
      group: 'visit',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({
          name: 'blocks',
          title: 'Details',
          type: 'array',
          of: [defineArrayMember({ type: 'specRow' })],
          description: 'Address, opening hours, nearest station.',
        }),
        defineField({ name: 'cta', type: 'cta' }),
        defineField({ name: 'mapEmbedUrl', title: 'Map embed URL', type: 'url' }),
      ],
    }),

    defineField({
      name: 'press',
      title: 'As seen in',
      type: 'object',
      group: 'press',
      fields: [
        defineField({ name: 'label', type: 'string', initialValue: 'As seen in' }),
        defineField({
          name: 'logos',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'image',
              fields: [
                defineField({ name: 'alt', title: 'Publication', type: 'string', validation: (r) => r.required() }),
                defineField({
                  name: 'height',
                  title: 'Display height (px)',
                  type: 'number',
                  description: 'Logos are optically balanced, so each sets its own height.',
                  initialValue: 30,
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});
