import { describe, it, expect, vi, afterEach } from "vitest";
import { hasRepoWriteAccess } from "./github-repo-access";

// SEC-002 (Medium, CWE-862) regression tests — audit-20260915-feature-04-cms.md.
// GitHub issues a valid OAuth token to any consenting account; only the
// repo's write API is permission-checked. This verifies that boundary is
// now enforced in code, restoring the authorization model ADR-007 claims.

describe("hasRepoWriteAccess", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("grants access when the authenticated user has write permission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/user")) {
          return { ok: true, json: async () => ({ login: "deep663" }) };
        }
        return { ok: true, json: async () => ({ permission: "write" }) };
      }),
    );
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(true);
  });

  it("grants access for admin permission too", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/user")) return { ok: true, json: async () => ({ login: "deep663" }) };
        return { ok: true, json: async () => ({ permission: "admin" }) };
      }),
    );
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(true);
  });

  it("denies access when the authenticated user is a non-collaborator (read/none)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/user")) return { ok: true, json: async () => ({ login: "random-user" }) };
        return { ok: true, json: async () => ({ permission: "none" }) };
      }),
    );
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(false);
  });

  it("fails closed when the GitHub API call itself errors (network failure)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(false);
  });

  it("fails closed when /user responds non-OK", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(false);
  });

  it("fails closed when the permission lookup responds non-OK", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/user")) return { ok: true, json: async () => ({ login: "deep663" }) };
        return { ok: false, json: async () => ({}) };
      }),
    );
    await expect(hasRepoWriteAccess("gho_tok")).resolves.toBe(false);
  });
});
