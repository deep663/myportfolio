/**
 * GitHub OAuth handshake logic for the Decap CMS admin auth flow
 * (STORY-4.4, ADR-007, `07-cms-architecture.md` §4). Pure/testable logic
 * lives here; `app/api/auth/route.ts` and `app/api/callback/route.ts` are
 * thin Route Handler wrappers around these functions so the
 * security-sensitive parts (URL construction, token exchange) are
 * unit-testable without a real HTTP server. The popup-page renderer that
 * used to live here moved to `lib/oauth-popup-html.ts` to keep both
 * components under the 100-line ceiling once SEC-001/SEC-005 were fixed.
 */

type ExchangeResult = { token: string } | { error: string };

/** Builds GitHub's authorize URL — case #1 of TS-001 §7.2. */
export function buildAuthorizeUrl(opts: {
  clientId: string;
  origin: string;
  state: string;
}): URL {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", opts.clientId);
  url.searchParams.set("scope", "repo");
  url.searchParams.set("redirect_uri", `${opts.origin}/api/callback`);
  url.searchParams.set("state", opts.state);
  return url;
}

/**
 * Exchanges an authorization `code` for an access token server-side only
 * — `clientSecret` never leaves this function. Never throws: a network
 * failure or a GitHub-reported error both resolve to `{ error }` with a
 * generic message, so the callback route never leaks internals in a
 * response body (TS-001 §7.2 case #4/#5).
 */
export async function exchangeCodeForToken(opts: {
  code: string;
  clientId: string;
  clientSecret: string;
  origin: string;
}): Promise<ExchangeResult> {
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: opts.clientId,
        client_secret: opts.clientSecret,
        code: opts.code,
        redirect_uri: `${opts.origin}/api/callback`,
      }),
    });
    const body = (await res.json()) as { access_token?: string; error?: string };
    if (body.access_token) return { token: body.access_token };
    return { error: body.error ?? "token_exchange_failed" };
  } catch {
    return { error: "token_exchange_failed" };
  }
}
