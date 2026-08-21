import { defineField, defineType } from 'sanity';

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Links to',
      type: 'string',
      description: 'A path such as /watches, an anchor such as #value-form, or a full URL.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});
