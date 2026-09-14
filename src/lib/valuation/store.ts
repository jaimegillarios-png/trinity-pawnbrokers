import { createClient } from '@sanity/client';
import { require_, type Env } from '../shop/env';

/**
 * Where valuation requests are kept.
 *
 * A request is a customer's name, email and phone number beside photographs of
 * something valuable they own. None of that may be publicly readable, and this
 * project's Sanity dataset is public — tested: 166 image assets list without a
 * token. So photos are NOT uploaded as Sanity assets.
 *
 * Instead the whole request is one document whose _id carries a dot
 * ("valuation.<id>"). Sanity keeps path-style ids out of anonymous reads even in
 * a public dataset — also tested: invisible without a token, visible with one.
 * The photos go inside it as data, already shrunk in the browser to a couple of
 * hundred KB each.
 *
 * That is the right trade at a pawnbroker's volume and wrong at a thousand a
 * day. When it stops being right, this file is the only one that changes: put
 * the photos in a private R2 bucket and store their keys here instead.
 */
export type ValuationPhoto = { name: string; mime: string; data: string; bytes: number };
export type ValuationDetail = { label: string; value: string };

export type ValuationRequest = {
  reference: string;
  item: string;
  name: string;
  email: string;
  phone: string;
  details: ValuationDetail[];
  photos: ValuationPhoto[];
  skippedPhotos: number;
  page: string;
};

export async function saveValuation(env: Env, request: ValuationRequest) {
  const client = createClient({
    projectId: require_(env, 'PUBLIC_SANITY_PROJECT_ID'),
    dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2026-01-01',
    useCdn: false,
    token: require_(env, 'SANITY_API_WRITE_TOKEN'),
  });

  await client.create({
    // The dot is what keeps this private. Do not drop it.
    _id: `valuation.${request.reference}`,
    _type: 'valuationRequest',
    status: 'new',
    receivedAt: new Date().toISOString(),
    reference: request.reference,
    item: request.item,
    name: request.name,
    email: request.email,
    phone: request.phone,
    page: request.page,
    details: request.details.map((d, i) => ({ _key: `d${i}`, _type: 'valuationDetail', ...d })),
    photos: request.photos.map((p, i) => ({ _key: `p${i}`, _type: 'valuationPhoto', ...p })),
    skippedPhotos: request.skippedPhotos,
  });
}
