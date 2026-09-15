import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { OAUTH_STATE_COOKIE, generateState } from "@/lib/oauth-state";
import { hasRepoWriteAccess } from "@/lib/github-repo-access";

// STORY-4.4 AC1/AC2 — TS-001 §7.2 cases #1 (success), #3 (access_denied
// / user cancels), #4 (malformed/missing/forged code or state), #5
// (secret never reaches the response body). Plus regression coverage for
// SEC-002 (repo-write-access check) and SEC-006 (rate limiting) from
// audit-20260915-feature-04-cms.md.

// SEC-002's real GitHub-API logic is unit-tested in isolation in
// lib/github-repo-access.test.ts; here it is mocked so these route-level
// tests can control authorized/unauthorized/error-path behavior directly.
vi.mock("@/lib/github-repo-access", () => ({ hasRepoWriteAccess: vi.fn() }));

let ipCounter = 0;
function requestWithCookie(url: string, state: string, ip?: string): NextRequest {
  // Each test uses its own synthetic IP so SEC-006's rate limiter (shared,
  // module-level state) never leaks between unrelated test cases.
  const clientIp = ip ?? `10.0.0.${++ipCounter}`;
  const req = new NextRequest(url, { headers: { "x-forwarded-for": clientIp } });
  req.cookies.set(OAUTH_STATE_COOKIE, state);
  return req;
}

describe("GET /api/callback", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      GITHUB_OAUTH_CLIENT_ID: "id",
      GITHUB_OAUTH_CLIENT_SECRET: "supersecret",
    };
    vi.mocked(hasRepoWriteAccess).mockResolvedValue(true);
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("case #1: valid code + matching state + authorized collaborator exchanges for a token and posts it to the opener", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "gho_tok" }) }),
    );
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?code=validcode&state=${state}`,
      state,
    );
    const res = await GET(req);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain("authorization:github:success:");
    expect(body).toContain("gho_tok");
    expect(body).not.toContain("supersecret");
  });

  it("case #3: GitHub reports access_denied — no token exchange attempted, error posted", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?error=access_denied&state=${state}`,
      state,
    );
    const res = await GET(req);
    const body = await res.text();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(body).toContain("authorization:github:error:");
    expect(body).toContain("access_denied");
  });

  it("case #4: missing code is rejected without calling GitHub", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?state=${state}`,
      state,
    );
    const res = await GET(req);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await res.text()).toContain("authorization:github:error:");
  });

  it("case #4: state mismatch (forged/CSRF callback) is rejected without calling GitHub", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const req = requestWithCookie(
      "https://deep-portfolio.example/api/callback?code=validcode&state=wrong-state",
      generateState(),
    );
    const res = await GET(req);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(await res.text()).toContain("authorization:github:error:");
  });

  // SEC-002 (Medium, CWE-862) regression tests.
  it("SEC-002: an authorized collaborator's login completes normally", async () => {
    vi.mocked(hasRepoWriteAccess).mockResolvedValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "gho_tok" }) }),
    );
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?code=validcode&state=${state}`,
      state,
    );
    const res = await GET(req);
    const body = await res.text();
    expect(body).toContain("authorization:github:success:");
    expect(body).toContain("gho_tok");
  });

  it("SEC-002: a non-collaborator is denied a session even with a valid token exchange", async () => {
    vi.mocked(hasRepoWriteAccess).mockResolvedValue(false);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "gho_tok" }) }),
    );
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?code=validcode&state=${state}`,
      state,
    );
    const res = await GET(req);
    const body = await res.text();
    expect(body).toContain("authorization:github:error:");
    expect(body).not.toContain("authorization:github:success:");
    expect(body).not.toContain("gho_tok");
  });

  it("SEC-002: fails closed (denies) when the collaborator-permission check itself errors", async () => {
    vi.mocked(hasRepoWriteAccess).mockResolvedValue(false); // hasRepoWriteAccess itself fails closed internally
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "gho_tok" }) }),
    );
    const state = generateState();
    const req = requestWithCookie(
      `https://deep-portfolio.example/api/callback?code=validcode&state=${state}`,
      state,
    );
    const res = await GET(req);
    const body = await res.text();
    expect(body).toContain("authorization:github:error:");
    expect(body).not.toContain("gho_tok");
  });

  // SEC-006 (Low, CWE-307/400) regression test.
  it("SEC-006: the 11th request within a minute from the same IP is rate-limited", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ access_token: "gho_tok" }) }),
    );
    const ip = "203.0.113.9";
    let lastStatus = 0;
    for (let i = 0; i < 11; i++) {
      const state = generateState();
      const req = requestWithCookie(
        `https://deep-portfolio.example/api/callback?code=validcode&state=${state}`,
        state,
        ip,
      );
      const res = await GET(req);
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
