import type { Image } from '@sanity/types';

export type SanityImage = Image & {
  alt?: string;
  asset?: {
    _id: string;
    url: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number; aspectRatio: number } };
  };
};

export interface Seo {
  title: string;
  description: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

export interface Cta { label: string; href: string }
export interface SectionIntro { eyebrow?: string; heading: string; intro?: string }
export interface IconCard { icon?: string; title: string; body: string; chip?: string }
export interface SpecRow { label: string; value: string; chip?: string }
export interface LedgerRow extends SpecRow { total?: boolean }
export interface TrustItem { text: string; chip?: string; highlight?: boolean }
export interface FaqItem { q: string; a: string; chip?: string }

export interface CompareRow {
  icon?: string;
  label: string;
  trinity: string;
  trinityChip?: string;
  highStreet: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'email' | 'tel';
  optional?: boolean;
  placeholder?: string;
  options?: string[];
  autocomplete?: string;
}

export interface FormRow { fields: FormField[] }

export interface ValuationForm {
  heading: string;
  intro?: string;
  stepOneLabel?: string;
  stepTwoLabel?: string;
  stepOneRows: FormRow[];
  stepTwoRows?: FormRow[];
  photosLabel?: string;
  photosHint?: string;
  continueLabel?: string;
  backLabel?: string;
  submitLabel?: string;
  noteStep1?: string;
  noteStep2?: string;
}

export interface HeroSection {
  image: SanityImage;
  eyebrow?: string;
  heading: string;
  intro: string;
  ctaPrimary: Cta;
  ctaGhost?: Cta;
  reassurance?: string;
}

export interface WorkedExample {
  label?: string;
  chip?: string;
  statement?: string;
  rows: LedgerRow[];
  note?: string;
}

export interface RepExample {
  label?: string;
  chip?: string;
  statement: string;
  note?: string;
}

export interface ClosingSection {
  eyebrow?: string;
  heading: string;
  intro?: string;
  cta?: Cta;
  contactPrefix?: string;
  contactSuffix?: string;
}

export interface AssetPage {
  _id: string;
  title: string;
  slug: string;
  order: number;
  nounSingular: string;
  nounPlural: string;
  cardImage: SanityImage;
  hero: HeroSection;
  trust?: TrustItem[];
  lendAgainst?: { intro?: SectionIntro; cards?: IconCard[] };
  borrow?: { intro?: SectionIntro; specs?: SpecRow[]; example?: WorkedExample };
  how?: { intro?: SectionIntro; steps?: IconCard[]; link?: Cta };
  valuation?: { intro?: SectionIntro; points?: IconCard[] };
  why?: { intro?: SectionIntro; rows?: CompareRow[] };
  proof?: { reviewsNote?: string; caseStudy?: WorkedExample & { label?: string } };
  faqs?: { intro?: SectionIntro; items?: FaqItem[] };
  closing?: ClosingSection;
  form: ValuationForm;
  repExample?: RepExample;
  seo: Seo;
}

export interface AssetPageCard {
  title: string;
  slug: string;
  nounPlural: string;
  cardImage: SanityImage;
  teaser?: string;
}

export interface AssetLendEntry extends AssetPageCard {
  /** The sub-categories that item page enumerates — "Bars and bullion", etc. */
  accepts?: string[];
}

export interface LendPage {
  intro?: SectionIntro;
  criteria?: { intro?: SectionIntro; items?: IconCard[] };
  other?: { title?: string; body?: string; cta?: Cta };
  closing?: ClosingSection;
  seo: Seo;
}

export interface RateStat {
  label?: string;
  figure?: string;
  note?: string;
  gold?: boolean;
}

export interface HomePage {
  hero: HeroSection;
  heroRotation?: SanityImage[];
  trust?: TrustItem[];
  indexIntro?: SectionIntro;
  indexOther?: { eyebrow?: string; title?: string; body?: string; cta?: Cta };
  how?: { intro?: SectionIntro; steps?: IconCard[] };
  custody?: { eyebrow?: string; statement?: string; note?: string; cta?: Cta };
  rates?: { intro?: SectionIntro; stats?: RateStat[]; footnote?: string };
  visit?: { intro?: SectionIntro; blocks?: SpecRow[]; cta?: Cta; mapEmbedUrl?: string };
  press?: { label?: string; logos?: Array<SanityImage & { height?: number }> };
  seo: Seo;
}

export interface AboutPage {
  hero: HeroSection;
  record?: SpecRow[];
  why?: { intro?: SectionIntro; paragraphs?: string[] };
  oneFirm?: { eyebrow?: string; statement?: string; note?: string; cta?: Cta; image?: SanityImage };
  bench?: { intro?: SectionIntro; disciplines?: IconCard[] };
  principles?: { intro?: SectionIntro; items?: IconCard[] };
  closing?: ClosingSection;
  seo: Seo;
}

export interface FaqGroup { title: string; items: FaqItem[] }

export interface FaqPage {
  intro?: SectionIntro;
  contactCta?: Cta;
  groups: FaqGroup[];
  closing?: ClosingSection;
  seo: Seo;
}

export interface ContactChannel {
  icon?: string;
  label: string;
  value: string;
  href?: string;
  note?: string;
}

export interface ContactPointer { title: string; body?: string; cta?: Cta }

export interface ContactPage {
  intro?: SectionIntro;
  channels: ContactChannel[];
  elsewhere?: ContactPointer[];
  visitIntro?: SectionIntro;
  mapEmbedUrl?: string;
  seo: Seo;
}

export interface HowStep { icon?: string; title: string; body: string; timing?: string }

export interface HowPage {
  intro?: SectionIntro;
  steps: HowStep[];
  terms?: { intro?: SectionIntro; rows?: SpecRow[]; note?: string };
  sending?: { intro?: SectionIntro; items?: IconCard[] };
  ending?: { intro?: SectionIntro; items?: IconCard[] };
  custody?: { eyebrow?: string; statement?: string; note?: string; cta?: Cta };
  closing?: ClosingSection;
  seo: Seo;
}

export interface LegalPage {
  title: string;
  slug: string;
  updatedAt: string;
  body: unknown[];
  seo: Seo;
}

export interface SiteSettings {
  name: string;
  ruleBarLeft?: string;
  ruleBarRight?: string;
  reviewsStore?: string;
  phone: string;
  phoneHref: string;
  email?: string;
  address?: {
    street?: string;
    locality?: string;
    region?: string;
    postcode?: string;
    country?: string;
  };
  openingHours?: string[];
  fcaReference: string;
  legalFooter: string;
  showConfirmNotes?: boolean;
  defaultSeo?: Seo;
  organisationLogo?: SanityImage;
}

/* ---------- blog ---------- */

export interface Post {
  title: string;
  slug: string;
  publishedAt: string;
  featured?: boolean;
  excerpt: string;
  coverImage: SanityImage;
  relatedAssets?: Array<{ title: string; slug: string; nounPlural: string }>;
  body: unknown[];
  seo?: Seo;
}

export interface BlogIndex {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  seo: Seo;
}
