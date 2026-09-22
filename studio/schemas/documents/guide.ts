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
      name: 'summary',
      title: 'Guides page description',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'What this guide covers, written to stand alone on the guides page. Not a cut-down first paragraph.',
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
            { title: 'Small print', value: 'small' },
          ],
        }),
        defineArrayMember({
          name: 'callout',
          title: 'Highlighted box',
          type: 'object',
          description: 'For the passages that need to stand apart: a key fact, a checklist, a compliance box.',
          fields: [
            defineField({
              name: 'tone',
              type: 'string',
              options: { list: [
                { title: 'Highlight', value: 'highlight' },
                { title: 'Compliance box (word for word, never reflowed)', value: 'verbatim' },
              ] },
              initialValue: 'highlight',
            }),
            defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
          ],
          preview: { select: { tone: 'tone' }, prepare: ({ tone }) => ({ title: tone === 'verbatim' ? 'Compliance box' : 'Highlighted box' }) },
        }),
        defineArrayMember({
          name: 'dataTable',
          title: 'Table',
          type: 'object',
          fields: [
            defineField({ name: 'caption', type: 'string', description: 'Optional. Said by screen readers; not shown.' }),
            defineField({
              name: 'rows',
              type: 'array',
              description: 'The first row is the heading row.',
              of: [defineArrayMember({
                name: 'row',
                type: 'object',
                fields: [defineField({
                  name: 'cells',
                  type: 'array',
                  of: [defineArrayMember({
                    name: 'cell',
                    type: 'object',
                    fields: [
                      defineField({ name: 'text', type: 'string' }),
                      defineField({ name: 'href', title: 'Link (optional)', type: 'string' }),
                    ],
                    preview: { select: { title: 'text' } },
                  })],
                })],
                preview: { select: { cells: 'cells' }, prepare: ({ cells }) => ({ title: (cells ?? []).map((c: { text?: string }) => c.text).join(' · ') }) },
              })],
            }),
          ],
          preview: { select: { rows: 'rows' }, prepare: ({ rows }) => ({ title: 'Table', subtitle: `${rows?.length ?? 0} rows` }) },
        }),
        defineArrayMember({
          name: 'faqList',
          title: 'Quick answers',
          type: 'object',
          description: 'Short question-and-answer pairs. They also feed the FAQ result in Google, so keep the wording identical to the page.',
          fields: [
            defineField({
              name: 'items',
              type: 'array',
              of: [defineArrayMember({
                name: 'qa',
                type: 'object',
                fields: [
                  defineField({ name: 'question', type: 'string' }),
                  defineField({ name: 'answer', type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] })] }),
                ],
                preview: { select: { title: 'question' } },
              })],
            }),
          ],
          preview: { select: { items: 'items' }, prepare: ({ items }) => ({ title: 'Quick answers', subtitle: `${items?.length ?? 0} questions` }) },
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'signature',
      type: 'string',
      group: 'content',
      description: 'Sits at the foot, above the sources. e.g. "Written by …, [role], Trinity Pawnbrokers."',
    }),
    defineField({
      name: 'sources',
      title: 'Sources and further reading',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        name: 'source',
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string' }),
          defineField({ name: 'href', title: 'Link (optional)', type: 'url' }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      })],
    }),
    defineField({ name: 'closing', type: 'text', rows: 4, group: 'content', description: 'The last paragraph of the guide, after the sources.' }),
    defineField({
      name: 'closingLink',
      title: 'Link after the closing paragraph',
      type: 'cta',
      group: 'content',
      description: 'A quiet text link, e.g. "Request a valuation". The arrow is added automatically.',
    }),
    defineField({
      name: 'closingBand',
      title: 'Closing band (optional)',
      type: 'closingSection',
      group: 'content',
      description: 'The dark band above the footer. Leave empty to use the one set on the Guides page.',
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Guides page order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
