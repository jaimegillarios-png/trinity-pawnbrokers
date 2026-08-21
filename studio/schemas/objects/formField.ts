import { defineField, defineType } from 'sanity';

export const formField = defineType({
  name: 'formField',
  title: 'Field',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Field ID',
      type: 'string',
      description: 'Used by the form and its label. Lower case, no spaces, e.g. wf-brand.',
      validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'lowercase and hyphens' }),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Keep it short — it has to fit on one line inside the field.',
      validation: (r) =>
        r.required().max(28).warning('Long labels wrap onto two lines on a phone.'),
    }),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Dropdown', value: 'select' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'text',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'optional',
      title: 'Optional',
      type: 'boolean',
      description: 'Adds "(optional)" after the label.',
      initialValue: false,
    }),
    defineField({
      name: 'placeholder',
      type: 'string',
      description: 'Example text shown in an empty field, e.g. "e.g. Submariner 116610LN".',
      hidden: ({ parent }) => parent?.type === 'select',
    }),
    defineField({
      name: 'options',
      title: 'Dropdown options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => parent?.type !== 'select',
      validation: (r) =>
        r.custom((options, ctx) => {
          const parent = ctx.parent as { type?: string } | undefined;
          if (parent?.type === 'select' && (!options || options.length === 0)) {
            return 'A dropdown needs at least one option.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'autocomplete',
      type: 'string',
      description:
        'Lets browsers fill this in automatically. Use name, email or tel on the contact step.',
    }),
  ],
  preview: {
    select: { title: 'label', type: 'type', optional: 'optional' },
    prepare: ({ title, type, optional }) => ({
      title,
      subtitle: [type, optional ? 'optional' : 'required'].join(' · '),
    }),
  },
});
