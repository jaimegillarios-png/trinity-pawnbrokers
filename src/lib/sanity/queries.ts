import { query } from './client';
import type {
  AssetPage, HomePage, AboutPage, FaqPage, LegalPage, SiteSettings, AssetPageCard, Post, BlogIndex,
} from '../types';

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
    "teaser": coalesce(cardTeaser, hero.intro)
  }`);

export const getHomePage = async (): Promise<HomePage> => {
  const home = await query<HomePage | null>(`*[_type == "homePage"][0]{
    hero { ..., image ${IMAGE} },
    heroRotation[] ${IMAGE},
    trust[],
    indexIntro ${SECTION_INTRO},
    indexOther,
    how { intro ${SECTION_INTRO}, steps[] },
    custody,
    rates { intro ${SECTION_INTRO}, stats[], footnote },
    visit { intro ${SECTION_INTRO}, blocks[], cta, mapEmbedUrl },
    press { label, logos[] ${IMAGE} },
    ${SEO}
  }`);

  if (!home) {
    throw new Error(
      'No "Homepage" document found in Sanity.\n' +
        '  Open the Studio (npm run studio) and fill it in,\n' +
        '  or run: node scripts/migrate-to-sanity.mjs',
    );
  }
  return home;
};

export const getAboutPage = async (): Promise<AboutPage> => {
  const about = await query<AboutPage | null>(`*[_type == "aboutPage"][0]{
    hero { ..., image ${IMAGE} },
    record[],
    why { intro ${SECTION_INTRO}, paragraphs },
    oneFirm { ..., image ${IMAGE} },
    bench { intro ${SECTION_INTRO}, disciplines[] },
    principles { intro ${SECTION_INTRO}, items[] },
    closing,
    ${SEO}
  }`);

  if (!about) {
    throw new Error(
      'No "About page" document found in Sanity.\n' +
        '  Open the Studio (npm run studio) and fill it in,\n' +
        '  or run: node scripts/migrate-to-sanity.mjs',
    );
  }
  return about;
};

export const getFaqPage = async (): Promise<FaqPage> => {
  const faq = await query<FaqPage | null>(`*[_type == "faqPage"][0]{
    intro ${SECTION_INTRO},
    groups[] { title, items[] },
    closing,
    ${SEO}
  }`);

  if (!faq) {
    throw new Error(
      'No "FAQ page" document found in Sanity.\n' +
        '  Open the Studio (npm run studio) and fill it in,\n' +
        '  or run: node scripts/migrate-to-sanity.mjs',
    );
  }
  return faq;
};

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

/* ---------- blog ---------- */

const POST = `{
  title,
  "slug": slug.current,
  publishedAt,
  featured,
  excerpt,
  coverImage ${IMAGE},
  relatedAssets[]->{ title, "slug": slug.current, nounPlural },
  body[]{ ..., _type == "image" => ${IMAGE} },
  ${SEO}
}`;

/**
 * Published articles only. A future date keeps a piece off the site until
 * the next build after it, which is what an editor expects from a date field.
 */
export const getPosts = () =>
  query<Post[]>(
    `*[_type == "post" && defined(publishedAt) && publishedAt <= now()]
      | order(publishedAt desc) ${POST}`,
  );

export const getBlogIndex = () =>
  query<BlogIndex | null>(`*[_type == "blogIndex"][0]{ eyebrow, title, standfirst, ${SEO} }`);
