import { defineField, defineType } from 'sanity';

export const howStep = defineType({
  name: 'howStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'timing',
      type: 'string',
      description: 'The short line beside the step — "Within 3 hours", "Same working hour".',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'timing' } },
});
