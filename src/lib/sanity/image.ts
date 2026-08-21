import imageUrlBuilder from '@sanity/image-url';
import type { Image } from '@sanity/types';
import { sanity } from './client';

const builder = imageUrlBuilder(sanity);

/** Sanity's image CDN does the resizing, cropping and format negotiation. */
export function urlFor(source: Image) {
  return builder.image(source).auto('format').fit('max');
}

/**
 * A responsive srcset at sensible widths. Returned rather than applied so a
 * component can still choose its own `sizes`.
 */
export function srcSetFor(source: Image, widths = [480, 768, 1024, 1440, 1920]) {
  return widths.map((w) => `${urlFor(source).width(w).url()} ${w}w`).join(', ');
}

/** Low-quality placeholder for the LCP image, inlined to avoid a round trip. */
export function lqipFor(source: Image & { asset?: { metadata?: { lqip?: string } } }) {
  return source?.asset?.metadata?.lqip;
}
