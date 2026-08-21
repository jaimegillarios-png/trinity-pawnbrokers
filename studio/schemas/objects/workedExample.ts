import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const workedExample = defineType({
  name: 'workedExample',
  title: 'Worked example',
  type: 'object',
  description:
    'A representative illustration of a loan. Every figure here is regulated communication — leave the confirmation note in place until compliance has signed it off.',
  fields: [
    defineField({ name: 'label', type: 'string', initialValue: 'Worked example' }),
    confirmChip,
    defineField({ name: 'statement', type: 'text', rows: 3 }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [{ type: 'ledgerRow' }],
      validation: (r) => r.required().min(2),
    }),
    defineField({ name: 'note', type: 'text', rows: 3 }),
  ],
});
