/**
 * Splits "Borrow against your *watch*." into plain and emphasised parts.
 * Editors mark the item name with asterisks; the template decides what that
 * means visually, so the CMS never carries markup.
 */
export function splitEmphasis(source: string): Array<{ text: string; emphasis: boolean }> {
  return source
    .split(/(\*[^*]+\*)/g)
    .filter((part) => part !== '')
    .map((part) =>
      part.startsWith('*') && part.endsWith('*') && part.length > 2
        ? { text: part.slice(1, -1), emphasis: true }
        : { text: part, emphasis: false },
    );
}
