import { defineArrayMember, defineField, defineType } from 'sanity';

export const assetPage = defineType({
  name: 'assetPage',
  title: 'Item page',
  type: 'document',
  description: 'One page per thing Trinity lends against — Watches, Gold, Diamonds and so on.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'form', title: 'Valuation form' },
    { name: 'compliance', title: 'Compliance' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Item',
      type: 'string',
      description: 'How this page is listed in the Studio, e.g. "Watches".',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The web address, e.g. "watches" becomes /watches.',
      options: { source: 'title', maxLength: 40 },
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order on the homepage',
      type: 'number',
      description: 'Lowest first.',
      group: 'content',
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: 'nounSingular',
      title: 'Noun (singular)',
      type: 'string',
      description: 'Used in running copy, e.g. "watch".',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nounPlural',
      title: 'Noun (plural)',
      type: 'string',
      description: 'e.g. "watches".',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cardImage',
      title: 'Homepage card image',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [defineField({ name: 'alt', type: 'string', validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),

    defineField({ name: 'hero', type: 'heroSection', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'trust',
      title: 'Trust strip',
      type: 'array',
      of: [defineArrayMember({ type: 'trustItem' })],
      group: 'content',
      validation: (r) => r.max(5).warning('More than five items wrap onto a second line.'),
    }),

    defineField({
      name: 'lendAgainst',
      title: 'What we lend against',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'cards', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'borrow',
      title: 'What you can borrow',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'specs', type: 'array', of: [defineArrayMember({ type: 'specRow' })] }),
        defineField({ name: 'example', type: 'workedExample' }),
      ],
    }),
    defineField({
      name: 'how',
      title: 'How it works',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'steps', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
        defineField({ name: 'link', type: 'cta' }),
      ],
    }),
    defineField({
      name: 'valuation',
      title: 'How we value it',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'points', type: 'array', of: [defineArrayMember({ type: 'iconCard' })] }),
      ],
    }),
    defineField({
      name: 'why',
      title: 'Why Trinity',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'rows', type: 'array', of: [defineArrayMember({ type: 'compareRow' })] }),
      ],
    }),
    defineField({
      name: 'proof',
      title: 'Proof',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'reviewsNote', type: 'text', rows: 2 }),
        defineField({ name: 'caseStudy', type: 'caseStudy' }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'intro', type: 'sectionIntro' }),
        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'faqItem' })] }),
      ],
    }),
    defineField({ name: 'closing', type: 'closingSection', group: 'content' }),

    defineField({ name: 'form', type: 'valuationForm', group: 'form', validation: (r) => r.required() }),

    defineField({ name: 'repExample', type: 'repExample', group: 'compliance' }),
    defineField({
      name: 'complianceNote',
      title: 'Internal note',
      type: 'text',
      rows: 3,
      description: 'Not published. A place to record instructions, e.g. "No LTV messaging — Rito, 29 Jul".',
      group: 'compliance',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo', validation: (r) => r.required() }),
  ],
  orderings: [
    { name: 'order', title: 'Homepage order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', media: 'cardImage' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: `/${subtitle ?? ''}`, media }),
  },
});
