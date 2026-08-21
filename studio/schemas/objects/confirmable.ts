import { defineField } from 'sanity';

/**
 * Every figure that compliance has not yet signed off carries a note. The site
 * renders it as an amber chip, and a single switch hides all of them for a
 * clean presentation — so the marker can stay in place until it is cleared,
 * rather than being deleted and forgotten.
 */
export const confirmChip = defineField({
  name: 'chip',
  title: 'Needs confirmation',
  type: 'string',
  description:
    'Leave empty once signed off. Any text here flags the figure as unverified, e.g. "Needs substantiated APR".',
});
