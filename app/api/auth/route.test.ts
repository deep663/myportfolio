import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { OAUTH_STATE_COOKIE } from "@/lib/oauth-state";

// STORY-4.4 AC1 (happy-path redirect to GitHub) — TS-001 §7.2 case #1.
// Plus SEC-006 (rate limiting) regression coverage from
// audit-20260915-feature-04-cms.md.

let ipCounter = 0;
function requestWithIp(url: string, ip?: string): NextRequest {
  const clientIp = ip ?? `10.1.0.${++ipCounter}`;
  return new NextRequest(url, { headers: { "x-forwarded-for": clientIp } });
}

describe("GET /api/auth", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, GITHUB_OAUTH_CLIENT_ID: "test-client-id" };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.restoreAllMocks();
  });

  it("redirects to GitHub's authorize URL with a fresh state, and sets the state cookie", async () => {
    const req = requestWithIp("https://deep-portfolio.example/api/auth");
    const res = await GET(req);

    expect(res.status).toBe(302);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.origin).toBe("https://github.com");
    expect(location.searchParams.get("client_id")).toBe("test-client-id");
    expect(location.searchParams.get("scope")).toBe("repo");

    const setCookie = res.cookies.get(OAUTH_STATE_COOKIE);
    expect(setCookie?.value).toBe(location.searchParams.get("state"));
    expect(setCookie?.httpOnly).toBe(true);
  });

  it("fails with a generic 500 (no internals leaked) when the OAuth client id is not configured", async () => {
    process.env.GITHUB_OAUTH_CLIENT_ID = "";
    const req = requestWithIp("https://deep-portfolio.example/api/auth");
    const res = await GET(req);
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).not.toContain("GITHUB_OAUTH_CLIENT_ID");
  });

  // SEC-005 (Low, CWE-346) — redirect_uri must come from the fixed site
  // origin, not the request's own Host-derived origin, once configured.
  it("SEC-005: builds redirect_uri from NEXT_PUBLIC_SITE_URL when configured, ignoring request origin", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://deep-portfolio.vercel.app";
    const req = requestWithIp("https://attacker.example/api/auth");
    const res = await GET(req);
    const location = new URL(res.headers.get("location") ?? "");
    expect(location.searchParams.get("redirect_uri")).toBe(
      "https://deep-portfolio.vercel.app/api/callback",
    );
  });

  // SEC-006 (Low, CWE-307/400) regression test.
  it("SEC-006: the 11th request within a minute from the same IP is rate-limited", async () => {
    const ip = "203.0.113.10";
    let lastStatus = 0;
    for (let i = 0; i < 11; i++) {
      const req = requestWithIp("https://deep-portfolio.example/api/auth", ip);
      const res = await GET(req);
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
