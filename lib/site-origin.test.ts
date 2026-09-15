import { describe, it, expect, afterEach, vi } from "vitest";
import { resolveSiteOrigin } from "./site-origin";

// SEC-005 (Low, CWE-346) regression tests — audit-20260915-feature-04-cms.md.
// The OAuth redirect_uri / postMessage target must come from a fixed,
// server-side configured origin, never the request's Host-derived origin.

describe("resolveSiteOrigin", () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_SITE_URL when it is configured, ignoring the request origin", () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: "https://deep-portfolio.vercel.app" };
    const origin = resolveSiteOrigin("https://attacker.example");
    expect(origin).toBe("https://deep-portfolio.vercel.app");
  });

  it("strips a trailing slash from the configured value", () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: "https://deep-portfolio.vercel.app/" };
    expect(resolveSiteOrigin("https://attacker.example")).toBe("https://deep-portfolio.vercel.app");
  });

  it("falls back to the request origin outside production when unset", () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: undefined, NODE_ENV: "development" };
    expect(resolveSiteOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("rejects (throws) rather than trusting the request origin in production when unset", () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: undefined, NODE_ENV: "production" };
    expect(() => resolveSiteOrigin("https://attacker.example")).toThrow();
  });
});
