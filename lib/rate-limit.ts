/**
 * SEC-006 fix (audit-20260915-feature-04-cms.md, CWE-307/400). Best-effort
 * in-memory sliding-window rate limiter for the two OAuth routes
 * (`/api/auth`, `/api/callback`), keyed by client IP. This is a
 * deliberately lightweight mitigation appropriate to a solo-editor site
 * on Vercel's serverless model: each function instance holds its own
 * counter and the counter resets whenever the instance recycles, so this
 * does not provide a hard cross-instance guarantee. A durable store
 * (Upstash/Vercel KV) would be needed for a stronger guarantee — not
 * justified for this scale/threat model.
 */
const WINDOW_MS = 60_000;
const LIMIT = 10;
const hitsByKey = new Map<string, number[]>();

/** Records a hit for `key` and returns whether it exceeds the threshold. */
export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const recent = (hitsByKey.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hitsByKey.set(key, recent);
  return recent.length > LIMIT;
}
