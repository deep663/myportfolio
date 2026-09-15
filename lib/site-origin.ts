/**
 * SEC-005 fix (audit-20260915-feature-04-cms.md, CWE-346). The OAuth
 * `redirect_uri` and `postMessage` target origin must come from a fixed,
 * server-side configured value — never `request.nextUrl.origin`, which is
 * derived from the incoming request's Host header and is not guaranteed
 * trustworthy (a misconfigured platform/App registration could let a
 * spoofed Host redirect the flow). `NEXT_PUBLIC_SITE_URL` is the single
 * source of truth in production; outside production the request origin is
 * still accepted as a convenience so `next dev`/preview work without the
 * env var set.
 */
export function resolveSiteOrigin(requestOrigin: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") return requestOrigin;
  throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
}
