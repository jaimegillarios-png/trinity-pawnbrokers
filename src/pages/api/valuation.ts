import type { APIRoute } from 'astro';
import { readEnv } from '../../lib/shop/env';
import { saveValuation, type ValuationDetail, type ValuationPhoto } from '../../lib/valuation/store';

export const prerender = false;

/* Sized for photos the browser has already shrunk (about 1600px on the long
   side, a few hundred KB). A browser without JavaScript sends the originals, and
   a phone's are several MB each — those are skipped and the record says how
   many, so staff know to ask for them rather than assume there were none. */
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 1_000_000;
const MAX_TOTAL_BYTES = 4_500_000;

const CONTACT = new Set(['wf-name', 'wf-email', 'wf-phone', 'wf-website', 'item', 'details', 'page']);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Short enough to read down a phone line, and unambiguous when you do:
 *  no 0/O, no 1/I/L. */
function makeReference() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

const text = (form: FormData, key: string, max: number) =>
  String(form.get(key) ?? '').trim().slice(0, max);

export const POST: APIRoute = async ({ request, locals }) => {
  const env = readEnv(locals);
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  /* A browser posting the form without JavaScript expects a page back, not a
     blob of JSON — so every outcome is expressed both ways. */
  const fail = (message: string, status: number) =>
    wantsJson ? json({ ok: false, error: message }, status) : new Response(message, { status });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('We could not read that form. Please try again.', 400);
  }

  // A field people never see. Bots fill every input they find.
  if (text(form, 'wf-website', 200)) {
    return wantsJson ? json({ ok: true, reference: makeReference() }) : Response.redirect(new URL('/valuation-received', request.url), 303);
  }

  const name = text(form, 'wf-name', 120);
  const email = text(form, 'wf-email', 200);
  const phone = text(form, 'wf-phone', 40);
  const item = text(form, 'item', 40);

  if (!name || !email || !phone) return fail('Please give your name, email and phone number.', 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('That email address does not look right.', 400);
  if (!/^[a-z-]{2,40}$/.test(item)) return fail('We could not tell what this valuation is for.', 400);

  /* With JavaScript the page sends each answer with the label the customer
     actually read ("Brand: Rolex"). Without it, fall back to the field names,
     which staff can still make sense of. */
  let details: ValuationDetail[] = [];
  try {
    const sent = JSON.parse(String(form.get('details') ?? '[]'));
    if (Array.isArray(sent)) {
      details = sent
        .filter((d) => d && typeof d.label === 'string' && typeof d.value === 'string' && d.value.trim())
        .slice(0, 20)
        .map((d) => ({ label: d.label.slice(0, 80), value: d.value.trim().slice(0, 500) }));
    }
  } catch {
    /* fall through to the raw fields */
  }
  if (!details.length) {
    for (const [key, value] of form.entries()) {
      if (CONTACT.has(key) || typeof value !== 'string' || !value.trim() || !key.startsWith('wf-')) continue;
      details.push({ label: key.replace(/^wf-/, ''), value: value.trim().slice(0, 500) });
    }
  }

  const photos: ValuationPhoto[] = [];
  let skipped = 0;
  let total = 0;
  for (const entry of form.getAll('photos')) {
    if (!(entry instanceof File) || !entry.size) continue;
    if (!entry.type.startsWith('image/') || photos.length >= MAX_PHOTOS
        || entry.size > MAX_PHOTO_BYTES || total + entry.size > MAX_TOTAL_BYTES) {
      skipped++;
      continue;
    }
    const buffer = new Uint8Array(await entry.arrayBuffer());
    let binary = '';
    for (let i = 0; i < buffer.length; i += 0x8000) {
      binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
    }
    photos.push({ name: entry.name.slice(0, 120) || 'photo.jpg', mime: entry.type, data: btoa(binary), bytes: entry.size });
    total += entry.size;
  }

  const reference = makeReference();
  try {
    await saveValuation(env, {
      reference,
      item,
      name,
      email,
      phone,
      details,
      photos,
      skippedPhotos: skipped,
      page: text(form, 'page', 200),
    });
  } catch (error) {
    console.error('valuation save failed', error);
    return fail('We could not send that just now. Please try again, or call us.', 502);
  }

  return wantsJson
    ? json({ ok: true, reference, photos: photos.length, skipped })
    : Response.redirect(new URL(`/valuation-received?ref=${reference}`, request.url), 303);
};
