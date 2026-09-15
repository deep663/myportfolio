import { describe, it, expect } from "vitest";
import { generateState, isValidState, OAUTH_STATE_COOKIE } from "./oauth-state";

// TS-001 §7.3 flags OAuth state-parameter CSRF protection as a gap to
// confirm is designed in — SEC-hard-rule authN/authZ coverage implements
// it here rather than deferring, since it's a standard OAuth control.

describe("lib/oauth-state.ts", () => {
  it("generateState returns a sufficiently long random hex string", () => {
    const state = generateState();
    expect(state).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generateState returns a different value on each call", () => {
    expect(generateState()).not.toBe(generateState());
  });

  it("isValidState is true when cookie and query state match", () => {
    const state = generateState();
    expect(isValidState(state, state)).toBe(true);
  });

  it("isValidState is false when cookie and query state differ", () => {
    expect(isValidState(generateState(), generateState())).toBe(false);
  });

  it("isValidState is false when either value is missing", () => {
    expect(isValidState(undefined, "abc")).toBe(false);
    expect(isValidState("abc", null)).toBe(false);
    expect(isValidState(undefined, null)).toBe(false);
  });

  it("isValidState is false when lengths differ (never throws on mismatched length)", () => {
    expect(isValidState("short", "muchlongerstatevalue")).toBe(false);
  });

  it("exposes the cookie name used to persist state across the redirect", () => {
    expect(OAUTH_STATE_COOKIE).toBe("decap_oauth_state");
  });
});
