import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const compareRow = defineType({
  name: 'compareRow',
  title: 'Comparison row',
  type: 'object',
  fields: [
    defineField({ name: 'icon', type: 'string', description: 'Phosphor icon name.' }),
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'trinity', title: 'Trinity', type: 'text', rows: 2, validation: (r) => r.required() }),
    { ...confirmChip, name: 'trinityChip', title: 'Needs confirmation (Trinity column)' },
    defineField({
      name: 'highStreet',
      title: 'Typical high street',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'trinity' } },
});
