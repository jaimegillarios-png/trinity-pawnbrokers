import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'Applies to every page. There is only one of these.',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'legal', title: 'Legal & regulatory' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Business name', type: 'string', group: 'brand', validation: (r) => r.required() }),
    defineField({
      name: 'ruleBarLeft',
      title: 'Top bar — left',
      type: 'string',
      group: 'brand',
      description: 'e.g. "Pawnbrokers · Est. 2013 · City of London".',
    }),
    defineField({
      name: 'ruleBarRight',
      title: 'Top bar — right',
      type: 'string',
      group: 'brand',
      description: 'e.g. "FCA-regulated · Ref 741896".',
    }),
    defineField({
      name: 'reviewsStore',
      title: 'Reviews.co.uk store ID',
      type: 'string',
      group: 'brand',
    }),

    defineField({ name: 'phone', title: 'Phone (display)', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({
      name: 'phoneHref',
      title: 'Phone (dialled)',
      type: 'string',
      description: 'International format, e.g. +442035671300.',
      group: 'contact',
      validation: (r) => r.required().regex(/^\+[0-9]+$/, { name: 'international format' }),
    }),
    defineField({ name: 'email', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'contact',
      description: 'Published as structured data so the business can appear in local search and Maps.',
      fields: [
        defineField({ name: 'street', type: 'string' }),
        defineField({ name: 'locality', title: 'Town or city', type: 'string' }),
        defineField({ name: 'region', title: 'County', type: 'string' }),
        defineField({ name: 'postcode', type: 'string' }),
        defineField({ name: 'country', type: 'string', initialValue: 'GB' }),
      ],
    }),
    defineField({
      name: 'openingHours',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'One line per entry, e.g. "Mo-Fr 09:00-18:00". Used for structured data.',
      group: 'contact',
    }),

    defineField({
      name: 'fcaReference',
      title: 'FCA reference number',
      type: 'string',
      group: 'legal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'legalFooter',
      title: 'Regulatory footer',
      type: 'text',
      rows: 5,
      description: 'The authorisation statement shown on every page. Use compliance wording verbatim.',
      group: 'legal',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'showConfirmNotes',
      title: 'Show unverified-figure markers',
      type: 'boolean',
      description:
        'On, every figure awaiting compliance shows an amber marker. Turn off before the site goes public.',
      initialValue: false,
      group: 'legal',
    }),

    defineField({
      name: 'defaultSeo',
      title: 'Fallback search & social',
      type: 'seo',
      group: 'seo',
      description: 'Used when a page has not set its own.',
    }),
    defineField({
      name: 'organisationLogo',
      title: 'Logo for search results',
      type: 'image',
      group: 'seo',
      description: 'Square, at least 512×512. Used in Google’s knowledge panel.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
