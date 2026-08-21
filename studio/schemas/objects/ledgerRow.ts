import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const ledgerRow = defineType({
  name: 'ledgerRow',
  title: 'Row',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'total',
      title: 'Emphasise as the total',
      type: 'boolean',
      initialValue: false,
    }),
    confirmChip,
  ],
  preview: {
    select: { title: 'label', subtitle: 'value', chip: 'chip' },
    prepare: ({ title, subtitle, chip }) => ({
      title,
      subtitle: chip ? `${subtitle}  ⚠ ${chip}` : subtitle,
    }),
  },
});
