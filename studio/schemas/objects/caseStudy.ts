import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'object',
  description: 'Only publish a case the customer has consented to in writing.',
  fields: [
    defineField({ name: 'label', type: 'string', initialValue: 'Case study · Redeemed' }),
    confirmChip,
    defineField({ name: 'statement', type: 'text', rows: 3 }),
    defineField({ name: 'rows', type: 'array', of: [{ type: 'ledgerRow' }] }),
    defineField({ name: 'note', type: 'text', rows: 2 }),
  ],
});
