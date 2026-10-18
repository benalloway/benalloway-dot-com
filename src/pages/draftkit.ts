// @ts-check

/**
 * /draftkit — live auction draft desk (Fantrax basketball, 8-team auction).
 *
 * Owner-directed standalone tool, byte-identical to final-draft-kit/5-live-desk.html.
 * NOTE: this is an explicit owner exception to the ADR-0005 subdomain-app rule —
 * it is a single self-contained page, not a subdomain app.
 */
import html from '../assets/draftkit/5-live-desk.html?raw';

export const GET = ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname !== '/draftkit') {
    return Response.redirect(new URL('/draftkit', url.origin), 308);
  }
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
};
