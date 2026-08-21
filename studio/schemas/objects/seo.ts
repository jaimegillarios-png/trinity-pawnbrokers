import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Search & social',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description:
        'Shown in Google results and the browser tab. Aim for 50–60 characters — longer gets truncated.',
      validation: (r) =>
        r.required().max(60).warning('Over 60 characters will be cut off in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'The grey summary under the title in Google. 140–155 characters. It does not affect ranking, but it does affect whether people click.',
      validation: (r) =>
        r.required().max(160).warning('Over 160 characters will be cut off in search results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image',
      type: 'image',
      description:
        'Used when the page is shared on WhatsApp, LinkedIn or X. 1200×630. Falls back to the site-wide image if empty.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Tick to keep this page out of Google and out of the sitemap.',
      initialValue: false,
    }),
  ],
});
