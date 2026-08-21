import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const specRow = defineType({
  name: 'specRow',
  title: 'Spec',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
    confirmChip,
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});
