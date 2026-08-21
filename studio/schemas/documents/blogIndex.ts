import { defineField, defineType } from 'sanity';

export const blogIndex = defineType({
  name: 'blogIndex',
  title: 'Blog index',
  type: 'document',
  description: 'The heading and search settings for /blog. Articles list themselves.',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'standfirst', type: 'text', rows: 3 }),
    defineField({ name: 'seo', type: 'seo', validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: 'Blog index' }) },
});
