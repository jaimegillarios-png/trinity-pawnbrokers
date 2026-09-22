import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * A guide: an evergreen reference piece, as opposed to a dated blog article.
 *
 * The differences are deliberate. Guides are listed in an order someone chose
 * (the one to read first comes first), not newest-first; they carry a "last
 * reviewed" date rather than a publish date, because what matters to a reader
 * is whether it is still accurate; and each h2 becomes an entry in the page's
 * contents list, since these run long and people come to them for one answer.
 *
 * Figures in [square brackets] are unconfirmed — rates, APR, LTV awaiting
 * sign-off. They are shown exactly as written. Do not "tidy" them into real
 * numbers here; that happens when compliance confirms them.
 */
export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 70 },
      description: 'The address: /guides/<this>.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position on the guides page',
      type: 'number',
      group: 'content',
      description: 'Lower comes first. The guide to read first should be 1.',
      initialValue: 10,
    }),
    defineField({
      name: 'standfirst',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'The one or two sentences under the title, and on the guides page.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last reviewed',
      type: 'date',
      group: 'content',
      description: 'When someone last checked this was still accurate. Shown on the page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Optional. A guide reads perfectly well without one.',
      fields: [defineField({ name: 'alt', type: 'string' })],
    }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Section heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'relatedAssets',
      title: 'Related item pages',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'assetPage' }] })],
      description: 'Shown at the end, e.g. the gold guide links to /gold.',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Guides page order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
