import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/github-oauth";
import { buildPostMessageHtml } from "@/lib/oauth-popup-html";
import { isValidState, OAUTH_STATE_COOKIE } from "@/lib/oauth-state";
import { hasRepoWriteAccess } from "@/lib/github-repo-access";
import { resolveSiteOrigin } from "@/lib/site-origin";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * STORY-4.4 — second leg of the Decap CMS GitHub OAuth handshake
 * (ADR-007, `07-cms-architecture.md` §4, TS-001 §7.2). Verifies the
 * CSRF state, denies on GitHub's own `access_denied`/error params
 * (case #3) or a missing/forged `code`/`state` (case #4) without ever
 * calling GitHub, exchanges a valid code for a token server-side only
 * (`GITHUB_OAUTH_CLIENT_SECRET` never leaves this function — case #5),
 * confirms the authenticated identity actually has repo write access
 * (SEC-002) before granting a session, and renders the popup page that
 * hands the result back to Decap via `postMessage`.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`callback:${clientIp}`)) {
    return new NextResponse("Too many requests.", { status: 429 });
  }

  let siteOrigin: string;
  try {
    siteOrigin = resolveSiteOrigin(request.nextUrl.origin);
  } catch {
    return new NextResponse("CMS authentication is not configured.", { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const queryState = searchParams.get("state");
  const errorParam = searchParams.get("error");
  const code = searchParams.get("code");

  const deny = (message: string) =>
    new NextResponse(buildPostMessageHtml({ status: "error", message }, siteOrigin), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });

  if (errorParam) return deny(errorParam);
  if (!isValidState(cookieState, queryState)) return deny("invalid_state");
  if (!code) return deny("missing_code");

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return deny("oauth_not_configured");

  const result = await exchangeCodeForToken({
    code,
    clientId,
    clientSecret,
    origin: siteOrigin,
  });

  if ("error" in result) return deny(result.error);
  if (!(await hasRepoWriteAccess(result.token))) return deny("insufficient_repo_access");

  const response = new NextResponse(
    buildPostMessageHtml({ status: "success", token: result.token }, siteOrigin),
    { status: 200, headers: { "Content-Type": "text/html" } },
  );
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
