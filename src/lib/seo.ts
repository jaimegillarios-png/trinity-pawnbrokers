import type { AssetPage, SiteSettings, Seo, SanityImage } from './types';
import { urlFor } from './sanity/image';

/**
 * Titles are built here rather than in each page so the pattern stays
 * consistent: the page's own title carries the keyword, the brand comes last,
 * and a page that has already said the brand name does not say it twice.
 */
export function pageTitle(seo: Seo, site: SiteSettings): string {
  const brand = site.name;
  return seo.title.includes(brand) ? seo.title : `${seo.title} | ${brand}`;
}

export function canonical(pathname: string, origin: string): string {
  const clean = pathname.replace(/index\.html?$/, '').replace(/\/+$/, '');
  return `${origin}${clean === '' ? '/' : clean}`;
}

export function ogImageUrl(seo: Seo, site: SiteSettings): string | undefined {
  const image: SanityImage | undefined = seo.ogImage ?? site.defaultSeo?.ogImage;
  if (!image?.asset) return undefined;
  return urlFor(image).width(1200).height(630).fit('crop').url();
}

/* ------------------------------------------------------------------ *
 * Structured data                                                     *
 * ------------------------------------------------------------------ */

/**
 * FinancialService is the correct type for a regulated lender — it inherits
 * from LocalBusiness, so the address, phone and hours are all eligible for
 * local search and Maps.
 */
export function organisationSchema(site: SiteSettings, origin: string) {
  const address = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${origin}/#organisation`,
    name: site.name,
    url: origin,
    telephone: site.phoneHref,
    ...(site.email ? { email: site.email } : {}),
    ...(site.organisationLogo?.asset
      ? { logo: urlFor(site.organisationLogo).width(512).height(512).fit('max').url() }
      : {}),
    ...(address?.locality
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(address.street ? { streetAddress: address.street } : {}),
            addressLocality: address.locality,
            ...(address.region ? { addressRegion: address.region } : {}),
            ...(address.postcode ? { postalCode: address.postcode } : {}),
            addressCountry: address.country ?? 'GB',
          },
        }
      : {}),
    ...(site.openingHours?.length ? { openingHours: site.openingHours } : {}),
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    // The FCA reference is the single most credible identifier a regulated
    // lender has. Publishing it as an identifier is worth more than a keyword.
    identifier: {
      '@type': 'PropertyValue',
      name: 'FCA Firm Reference Number',
      value: site.fcaReference,
    },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Eligible for the expandable FAQ block directly in Google results. */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Each item page is a distinct service offering, not just a page. */
export function serviceSchema(page: AssetPage, site: SiteSettings, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Pawn loans against ${page.nounPlural}`,
    name: page.seo.title,
    description: page.seo.description,
    url: `${origin}/${page.slug}`,
    provider: { '@id': `${origin}/#organisation` },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    ...(site.address?.locality
      ? { availableAtOrFrom: { '@type': 'Place', name: site.address.locality } }
      : {}),
  };
}
