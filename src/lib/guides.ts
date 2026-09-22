type Span = { text?: string };
type Block = { _type?: string; _key?: string; style?: string; children?: Span[]; anchor?: string };

/** Plain text of a block. Written here rather than imported: the renderer's
 *  own helper pulls an .astro component into a plain .ts file. */
const textOf = (b: Block) => (b.children ?? []).map((c) => c.text ?? '').join('').trim();

/** A heading's anchor: lowercase words joined with hyphens. */
export function anchorFor(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'section'
  );
}

/**
 * Stamps an anchor onto every h2 and returns the contents list built from the
 * same values. Doing both in one pass is the point: the heading renders the id
 * it was given, the contents list links to that id, and they cannot disagree —
 * including when two sections share a heading, which get -2, -3 in order.
 */
export function withContents(body: unknown[]) {
  const seen = new Map<string, number>();
  const contents: Array<{ id: string; text: string }> = [];
  const stamped = (body as Block[]).map((b) => {
    if (b?._type !== 'block' || b.style !== 'h2') return b;
    const text = textOf(b);
    const base = anchorFor(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const id = n ? `${base}-${n + 1}` : base;
    contents.push({ id, text });
    return { ...b, anchor: id };
  });
  return { body: stamped, contents };
}

/** Reading time at 220 words a minute, never less than one. */
export function readingMinutes(body: unknown[]): number {
  const words = (body as Block[])
    .filter((b) => b?._type === 'block')
    .map(textOf)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
