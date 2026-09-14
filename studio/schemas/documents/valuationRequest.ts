import { defineArrayMember, defineField, defineType } from 'sanity';
import { ValuationPhotos } from '../../components/ValuationPhotos';

/**
 * A valuation request sent from the form on an item page.
 *
 * Created by /api/valuation, never by hand — so everything the customer sent is
 * read-only, and the one thing staff change is the status. Every one of these
 * is stored under an id beginning "valuation.", which is what keeps a
 * customer's contact details and photographs out of this public dataset's
 * anonymous API. Do not create them with any other id.
 */
export const valuationRequest = defineType({
  name: 'valuationRequest',
  title: 'Valuation request',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Offer made', value: 'offered' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'reference', type: 'string', readOnly: true }),
    defineField({ name: 'receivedAt', title: 'Received', type: 'datetime', readOnly: true }),
    defineField({ name: 'item', title: 'What it is', type: 'string', readOnly: true }),
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({
      name: 'details',
      title: 'What they told us',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          name: 'valuationDetail',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'value', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    defineField({
      name: 'photos',
      type: 'array',
      readOnly: true,
      components: { input: ValuationPhotos },
      of: [
        defineArrayMember({
          name: 'valuationPhoto',
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'mime', type: 'string' }),
            defineField({ name: 'data', type: 'text' }),
            defineField({ name: 'bytes', type: 'number' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'skippedPhotos',
      title: 'Photos we could not keep',
      type: 'number',
      readOnly: true,
      description:
        'Sent but too large to store — usually a browser without JavaScript sending full-size phone photos. Ask the customer to email them.',
    }),
    defineField({ name: 'page', title: 'Sent from', type: 'string', readOnly: true }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'receivedAt', direction: 'desc' }] }],
  preview: {
    select: { name: 'name', item: 'item', status: 'status', reference: 'reference' },
    prepare: ({ name, item, status, reference }) => ({
      title: `${name ?? 'Unknown'} — ${item ?? ''}`,
      subtitle: `${reference ?? ''} · ${status ?? 'new'}`,
    }),
  },
});
