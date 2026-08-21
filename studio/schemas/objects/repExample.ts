import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const repExample = defineType({
  name: 'repExample',
  title: 'Representative example',
  type: 'object',
  description:
    'Required by the FCA where a rate is quoted. Paste it exactly as compliance supplies it — do not paraphrase.',
  fields: [
    defineField({ name: 'label', type: 'string', initialValue: 'Representative example' }),
    confirmChip,
    defineField({ name: 'statement', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'note', type: 'text', rows: 3 }),
  ],
});
