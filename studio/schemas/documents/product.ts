import { defineArrayMember, defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Shop item',
  type: 'document',
  description:
    'One piece. Everything here is one of a kind, so there is no quantity — an item is available or it is sold.',
  groups: [
    { name: 'item', title: 'The item', default: true },
    { name: 'detail', title: 'Specification' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'item', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 70 },
      group: 'item',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'brand', type: 'string', group: 'item', validation: (r) => r.required() }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'item',
      initialValue: 'available',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Sold', value: 'sold' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (pence)',
      type: 'number',
      description: 'In pence, because that is what Stripe charges in. £7,495 is 749500.',
      group: 'item',
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: 'rrp',
      title: 'RRP (pence)',
      type: 'number',
      description: 'Optional. Shown struck through beside the price when it is higher.',
      group: 'item',
    }),
    defineField({
      name: 'images',
      type: 'array',
      group: 'item',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string' })],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      group: 'item',
      description: 'The line under the title on the list and the detail page.',
      validation: (r) => r.required(),
    }),

    defineField({ name: 'reference', title: 'Reference number', type: 'string', group: 'detail' }),
    defineField({ name: 'year', type: 'string', group: 'detail' }),
    defineField({
      name: 'specs',
      title: 'Specification',
      type: 'array',
      of: [defineArrayMember({ type: 'specRow' })],
      group: 'detail',
      description: 'Case, dial, movement, bracelet — whatever the piece warrants.',
    }),
    defineField({
      name: 'condition',
      type: 'text',
      rows: 4,
      group: 'detail',
      description: 'Said plainly. A buyer at this price reads this before anything else.',
    }),
    defineField({ name: 'boxAndPapers', title: 'Box and papers', type: 'string', group: 'detail' }),
    defineField({ name: 'warranty', type: 'string', group: 'detail' }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Price, high to low', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
    { title: 'Price, low to high', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', brand: 'brand', status: 'status', media: 'images.0' },
    prepare: ({ title, brand, status, media }) => ({
      title,
      subtitle: `${brand}${status !== 'available' ? ` · ${status}` : ''}`,
      media,
    }),
  },
});
