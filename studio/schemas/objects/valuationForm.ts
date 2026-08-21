import { defineField, defineType } from 'sanity';

export const valuationForm = defineType({
  name: 'valuationForm',
  title: 'Valuation form',
  type: 'object',
  description: 'The two-step form in the hero. Step 1 asks about the item, step 2 about the person.',
  fields: [
    defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({
      name: 'stepOneLabel',
      title: 'Step 1 label',
      type: 'string',
      initialValue: 'Step 1 of 2 · Your item',
    }),
    defineField({
      name: 'stepTwoLabel',
      title: 'Step 2 label',
      type: 'string',
      initialValue: 'Step 2 of 2 · You',
    }),
    defineField({
      name: 'stepOneRows',
      title: 'Step 1 rows',
      type: 'array',
      of: [{ type: 'formRow' }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'stepTwoRows',
      title: 'Step 2 rows',
      type: 'array',
      of: [{ type: 'formRow' }],
    }),
    defineField({
      name: 'photosLabel',
      title: 'Photo upload label',
      type: 'string',
      initialValue: 'Add photos',
    }),
    defineField({
      name: 'photosHint',
      title: 'Photo hint',
      type: 'string',
      description: 'Tell people which angles help the valuation.',
    }),
    defineField({ name: 'continueLabel', type: 'string', initialValue: 'Continue' }),
    defineField({ name: 'backLabel', type: 'string', initialValue: 'Back' }),
    defineField({ name: 'submitLabel', type: 'string', initialValue: 'Get my valuation' }),
    defineField({ name: 'noteStep1', title: 'Note under step 1', type: 'text', rows: 2 }),
    defineField({ name: 'noteStep2', title: 'Note under step 2', type: 'text', rows: 2 }),
  ],
});
