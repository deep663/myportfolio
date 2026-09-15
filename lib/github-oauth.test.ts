import { describe, it, expect, vi, afterEach } from "vitest";
import { buildAuthorizeUrl, exchangeCodeForToken } from "./github-oauth";

// TS-001 §7.2 test matrix cases #1 (happy path redirect/exchange shape),
// #3 (access_denied), #4 (malformed/missing code) — covered as unit tests
// against this pure-logic module, with GitHub's token endpoint mocked via
// global fetch (case #5, secret-never-in-response, is covered here by
// asserting the exchange result never carries the secret; the popup
// renderer itself moved to lib/oauth-popup-html.test.ts).

describe("buildAuthorizeUrl", () => {
  it("builds GitHub's authorize URL with client_id, repo scope, redirect_uri, and state", () => {
    const url = buildAuthorizeUrl({
      clientId: "abc123",
      origin: "https://deep-portfolio.example",
      state: "the-state-value",
    });
    expect(url.origin).toBe("https://github.com");
    expect(url.pathname).toBe("/login/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("abc123");
    expect(url.searchParams.get("scope")).toBe("repo");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://deep-portfolio.example/api/callback",
    );
    expect(url.searchParams.get("state")).toBe("the-state-value");
  });
});

describe("exchangeCodeForToken", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a token on a successful GitHub exchange", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "gho_realtoken" }),
      }),
    );
    const result = await exchangeCodeForToken({
      code: "valid-code",
      clientId: "id",
      clientSecret: "secret",
      origin: "https://deep-portfolio.example",
    });
    expect(result).toEqual({ token: "gho_realtoken" });
  });

  it("returns an error when GitHub responds with an error body (case #3/#4)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ error: "bad_verification_code" }),
      }),
    );
    const result = await exchangeCodeForToken({
      code: "replayed-or-invalid",
      clientId: "id",
      clientSecret: "secret",
      origin: "https://deep-portfolio.example",
    });
    expect(result).toEqual({ error: "bad_verification_code" });
  });

  it("returns a generic error (no internals leaked) when the HTTP call itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const result = await exchangeCodeForToken({
      code: "any",
      clientId: "id",
      clientSecret: "secret",
      origin: "https://deep-portfolio.example",
    });
    expect(result).toEqual({ error: "token_exchange_failed" });
  });
});
