import { defineField, defineType } from 'sanity';

/** The eyebrow / heading / intro trio that opens most sections. */
export const sectionIntro = defineType({
  name: 'sectionIntro',
  title: 'Section opener',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Small gold caps above the heading.',
    }),
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
});
