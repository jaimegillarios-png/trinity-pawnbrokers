import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the deployed
 * origin — a robots.txt pointing at the wrong host is a silent SEO failure.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://trinitypawnbrokers.co.uk';
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# The Studio is an editing tool, not content.',
    'Disallow: /studio',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
