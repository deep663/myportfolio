import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/github-oauth";
import { generateState, OAUTH_STATE_COOKIE } from "@/lib/oauth-state";
import { resolveSiteOrigin } from "@/lib/site-origin";
import { isRateLimited } from "@/lib/rate-limit";

/**
 * STORY-4.4 — first leg of the Decap CMS GitHub OAuth handshake
 * (ADR-007, `07-cms-architecture.md` §4). Redirects the admin login
 * popup to GitHub's authorize screen, requesting `repo` scope. GitHub's
 * own OAuth grant no longer doubles as the authorization boundary (see
 * SEC-002 fix in `/api/callback`) — this route only starts the handshake.
 * A fresh CSRF state value is generated and stored in a short-lived
 * httpOnly cookie so `/api/callback` can verify the redirect that comes
 * back actually originated from this request (TS-001 §7.3).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`auth:${clientIp}`)) {
    return new NextResponse("Too many requests.", { status: 429 });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("CMS authentication is not configured.", { status: 500 });
  }

  let origin: string;
  try {
    origin = resolveSiteOrigin(request.nextUrl.origin);
  } catch {
    return new NextResponse("CMS authentication is not configured.", { status: 500 });
  }

  const state = generateState();
  const authorizeUrl = buildAuthorizeUrl({ clientId, origin, state });

  const response = NextResponse.redirect(authorizeUrl, 302);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/api",
  });
  return response;
}
