import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const iconCard = defineType({
  name: 'iconCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Phosphor icon name, e.g. ph-watch, ph-scales, ph-vault. See phosphoricons.com.',
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 3, validation: (r) => r.required() }),
    confirmChip,
  ],
  preview: { select: { title: 'title', subtitle: 'body' } },
});
