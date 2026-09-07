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

/**
 * A srcset for an image that is displayed at a fixed aspect ratio.
 *
 * The plain srcset above serves the photograph uncropped. Paired with a `src`
 * that asks for a crop, the browser takes a srcset candidate instead — so the
 * crop never applied, and the CSS had to `object-fit: cover` a 4:3 image into
 * a square, scaling it up to do so. On a shop whose whole job is showing a
 * watch clearly, that softness is the one thing not to get wrong.
 *
 * Pass the same ratio the CSS frames it at, and every candidate arrives
 * already cropped to it.
 */
export function croppedSrcSetFor(
  source: Image,
  ratio = 1,
  widths = [400, 600, 800, 1200, 1600],
) {
  return widths
    .map((w) => {
      const url = builder
        .image(source)
        .auto('format')
        .width(w)
        .height(Math.round(w / ratio))
        .fit('crop')
        .url();
      return `${url} ${w}w`;
    })
    .join(', ');
}

/** Low-quality placeholder for the LCP image, inlined to avoid a round trip. */
export function lqipFor(source: Image & { asset?: { metadata?: { lqip?: string } } }) {
  return source?.asset?.metadata?.lqip;
}
