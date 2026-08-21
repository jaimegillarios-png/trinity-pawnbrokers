import { defineField, defineType } from 'sanity';
import { confirmChip } from './confirmable';

export const trustItem = defineType({
  name: 'trustItem',
  title: 'Trust strip item',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      description: 'Short. These sit on one line across the strip.',
      validation: (r) => r.required().max(44).warning('Long items push the strip onto two lines.'),
    }),
    confirmChip,
  ],
  preview: { select: { title: 'text', subtitle: 'chip' } },
});
