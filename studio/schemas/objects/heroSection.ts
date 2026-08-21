import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      description:
        'The full-bleed background. Landscape, at least 2000px wide. The hotspot decides what stays in frame on a phone.',
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
      name: 'eyebrow',
      type: 'string',
      description: 'Gold caps above the headline.',
    }),
    defineField({
      name: 'heading',
      type: 'text',
      rows: 2,
      description:
        'Wrap the item name in *asterisks* to set it in gold with an underscore, e.g. "Borrow against your *watch*."',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'intro', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'ctaPrimary', title: 'Primary button', type: 'cta', validation: (r) => r.required() }),
    defineField({ name: 'ctaGhost', title: 'Secondary button', type: 'cta' }),
    defineField({
      name: 'reassurance',
      type: 'string',
      description: 'The small line under the buttons.',
    }),
  ],
});
