import { defineField, defineType } from 'sanity';

export const closingSection = defineType({
  name: 'closingSection',
  title: 'Closing band',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'cta', title: 'Button', type: 'cta' }),
    defineField({
      name: 'contactPrefix',
      type: 'string',
      description: 'Text before the phone number, e.g. "Or call us on".',
    }),
    defineField({ name: 'contactSuffix', type: 'string' }),
  ],
});
