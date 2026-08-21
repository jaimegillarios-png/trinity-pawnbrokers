import { defineField, defineType } from 'sanity';

export const formRow = defineType({
  name: 'formRow',
  title: 'Row',
  type: 'object',
  description: 'One or two fields side by side. Two-up rows stack on narrow screens.',
  fields: [
    defineField({
      name: 'fields',
      type: 'array',
      of: [{ type: 'formField' }],
      validation: (r) => r.required().min(1).max(2),
    }),
  ],
  preview: {
    select: { fields: 'fields' },
    prepare: ({ fields = [] }) => ({
      title: fields.map((f: { label?: string }) => f?.label ?? '—').join('  ·  '),
      subtitle: `${fields.length} field${fields.length === 1 ? '' : 's'}`,
    }),
  },
});
