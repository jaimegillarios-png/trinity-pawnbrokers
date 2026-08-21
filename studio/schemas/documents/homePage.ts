import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'hero', type: 'heroSection', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'heroRotation',
      title: 'Additional hero images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', validation: (r) => r.required() })],
        }),
      ],
      description: 'The hero cycles through these behind the headline. Leave empty for a still image.',
      group: 'content',
    }),
    defineField({
      name: 'trust',
      title: 'Trust strip',
      type: 'array',
      of: [defineArrayMember({ type: 'trustItem' })],
      group: 'content',
    }),
    defineField({
      name: 'indexIntro',
      title: 'Item index opener',
      type: 'sectionIntro',
      description: 'Introduces the grid of things you lend against.',
      group: 'content',
    }),
    defineField({
      name: 'how',
      title: 'How it works',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'steps', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'custody',
      title: 'Who holds your item',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'points', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'rates',
      title: 'Fair, and provably so',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'specs', type: 'array', of: [defineArrayMember({ type: 'specRow' })] }),
      ],
    }),
    defineField({
      name: 'visit',
      title: 'Visit us',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'mapEmbedUrl', title: 'Map embed URL', type: 'url' }),
        defineField({ name: 'notes', type: 'array', of: [defineArrayMember({ type: 'specRow' })] }),
      ],
    }),
    defineField({
      name: 'press',
      title: 'As seen in',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'label', type: 'string', initialValue: 'As seen in' }),
        defineField({
          name: 'logos',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'image',
              fields: [
                defineField({ name: 'alt', title: 'Publication name', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'url', title: 'Link to article', type: 'url' }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({ name: 'closing', type: 'closingSection', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});
