import { defineArrayMember, defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  description:
    'The main way the site earns search traffic for the questions people actually ask before pawning something.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The web address. Becomes /blog/your-title.',
      options: { source: 'title', maxLength: 80 },
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      description: 'Articles are listed newest first. A future date keeps it off the site until then.',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown on the index and used as the search description if none is set.',
      group: 'content',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers and search engines.',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'relatedAssets',
      title: 'Related item pages',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'assetPage' }] })],
      description:
        'Links the article to the pages it supports. Internal links between related pages are most of what makes a blog worth having for search.',
      group: 'content',
    }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullets', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'caption', type: 'string' }),
          ],
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { name: 'newest', title: 'Newest first', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle
        ? new Date(subtitle).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No date — will not publish',
      media,
    }),
  },
});
