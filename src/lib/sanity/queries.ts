import { query } from './client';
import type { AssetPage, HomePage, LegalPage, SiteSettings, AssetPageCard } from '../types';

/** Images always carry their metadata so we can emit dimensions and an LQIP. */
const IMAGE = `{ ..., alt, asset->{ _id, url, metadata { lqip, dimensions } } }`;

const SEO = `seo { title, description, noIndex, ogImage ${IMAGE} }`;

const SECTION_INTRO = `{ eyebrow, heading, intro }`;

const ASSET_PAGE = `{
  _id,
  title,
  "slug": slug.current,
  order,
  nounSingular,
  nounPlural,
  cardImage ${IMAGE},
  hero {
    ...,
    image ${IMAGE},
    ctaPrimary, ctaGhost
  },
  trust[],
  lendAgainst { intro ${SECTION_INTRO}, cards[] },
  borrow { intro ${SECTION_INTRO}, specs[], example },
  how { intro ${SECTION_INTRO}, steps[], link },
  valuation { intro ${SECTION_INTRO}, points[] },
  why { intro ${SECTION_INTRO}, rows[] },
  proof { reviewsNote, caseStudy },
  faqs { intro ${SECTION_INTRO}, items[] },
  closing,
  form,
  repExample,
  ${SEO}
}`;

/**
 * Every page depends on this, so a missing document has to say so. Without the
 * guard the build dies on `Cannot read properties of null`, which tells whoever
 * is looking at the failure nothing about what to do next.
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const settings = await query<SiteSettings | null>(`*[_type == "siteSettings"][0]{
    ...,
    organisationLogo ${IMAGE},
    defaultSeo { ..., ogImage ${IMAGE} }
  }`);

  if (!settings) {
    throw new Error(
      'No "Site settings" document found in Sanity.\n' +
        '  Open the Studio (npm run studio) and fill in Site settings,\n' +
        '  or run: node scripts/migrate-to-sanity.mjs',
    );
  }
  return settings;
};

export const getAssetPage = (slug: string) =>
  query<AssetPage | null>(`*[_type == "assetPage" && slug.current == $slug][0] ${ASSET_PAGE}`, {
    slug,
  });

export const getAssetPages = () =>
  query<AssetPage[]>(`*[_type == "assetPage"] | order(order asc) ${ASSET_PAGE}`);

/** Just enough for the homepage grid and the sitemap — no need to pull whole pages. */
export const getAssetPageCards = () =>
  query<AssetPageCard[]>(`*[_type == "assetPage"] | order(order asc) {
    title,
    "slug": slug.current,
    nounPlural,
    cardImage ${IMAGE},
    "teaser": hero.intro
  }`);

export const getHomePage = () =>
  query<HomePage>(`*[_type == "homePage"][0]{
    ...,
    hero { ..., image ${IMAGE} },
    heroRotation[] ${IMAGE},
    indexIntro ${SECTION_INTRO},
    how { intro ${SECTION_INTRO}, steps[] },
    custody { intro ${SECTION_INTRO}, points[] },
    rates { intro ${SECTION_INTRO}, specs[] },
    visit { intro ${SECTION_INTRO}, mapEmbedUrl, notes[] },
    press { label, logos[] ${IMAGE} },
    closing,
    ${SEO}
  }`);

export const getLegalPages = () =>
  query<LegalPage[]>(`*[_type == "legalPage"] | order(title asc) {
    title, "slug": slug.current, updatedAt, body, ${SEO}
  }`);

export const getLegalPage = (slug: string) =>
  query<LegalPage | null>(
    `*[_type == "legalPage" && slug.current == $slug][0]{
      title, "slug": slug.current, updatedAt, body, ${SEO}
    }`,
    { slug },
  );
