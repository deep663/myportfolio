import { describe, it, expect } from "vitest";
import { isRateLimited } from "./rate-limit";

// SEC-006 (Low, CWE-307/400) regression tests — audit-20260915-feature-04-cms.md.
// Best-effort per-instance sliding-window limiter for the two OAuth routes.

describe("isRateLimited", () => {
  it("allows requests under the threshold", () => {
    const key = "1.2.3.4-under";
    for (let i = 0; i < 10; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  it("blocks once a key exceeds the threshold within the window", () => {
    const key = "1.2.3.4-over";
    for (let i = 0; i < 10; i++) isRateLimited(key);
    expect(isRateLimited(key)).toBe(true);
  });

  it("tracks separate keys independently", () => {
    for (let i = 0; i < 10; i++) isRateLimited("keyA");
    expect(isRateLimited("keyA")).toBe(true);
    expect(isRateLimited("keyB")).toBe(false);
  });

  it("resets once the sliding window has fully elapsed", () => {
    const key = "1.2.3.4-window";
    const t0 = 1_000_000;
    for (let i = 0; i < 10; i++) isRateLimited(key, t0);
    expect(isRateLimited(key, t0)).toBe(true);
    expect(isRateLimited(key, t0 + 61_000)).toBe(false);
  });
});
