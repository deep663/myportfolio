import { randomBytes, timingSafeEqual } from "node:crypto";

/**
 * CSRF state-parameter helpers for the Decap CMS GitHub OAuth handshake
 * (STORY-4.4, ADR-007). Not called out in `07-cms-architecture.md`'s
 * sequence diagram, but flagged by TS-001 §7.3 as a standard OAuth
 * security control this architecture should confirm is designed in —
 * implemented here per this agent's own SEC hard rules rather than left
 * as a gap. `app/api/auth/route.ts` generates a state value and stores it
 * in a short-lived cookie; `app/api/callback/route.ts` verifies the
 * callback's `state` query param matches that cookie before ever
 * exchanging the `code` for a token, preventing a forged callback from a
 * third-party site from completing the login on Deep Senchowa's behalf.
 */

export const OAUTH_STATE_COOKIE = "decap_oauth_state";

/** 32 random bytes (256 bits), hex-encoded — unguessable, single-use. */
export function generateState(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Constant-time comparison of the state stored at redirect-time against
 * the state GitHub echoes back on the callback. Returns `false` (never
 * throws) for any missing value or length mismatch, so a malformed or
 * forged callback is rejected rather than crashing the route handler.
 */
export function isValidState(
  cookieState: string | undefined,
  queryState: string | null,
): boolean {
  if (!cookieState || !queryState) return false;
  const a = Buffer.from(cookieState);
  const b = Buffer.from(queryState);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
