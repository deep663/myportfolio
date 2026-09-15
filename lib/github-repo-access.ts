/**
 * SEC-002 fix (audit-20260915-feature-04-cms.md, CWE-862). GitHub's
 * `scope=repo` OAuth grant issues a valid token to *any* consenting
 * account — it does not, by itself, mean that account has write access
 * to this repo (only the later Content API write call is permission-
 * checked). ADR-007 already assumes repo-collaborator authorization is
 * the boundary; this restores that boundary in code rather than changing
 * the design. Fails closed on any unexpected response or network error.
 *
 * `GITHUB_REPO_OWNER`/`GITHUB_REPO_NAME` default to the values already
 * pinned in `public/admin/config.yml`'s `backend.repo`.
 */
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "deep663";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "deep-portfolio";
const WRITE_PERMISSIONS = new Set(["admin", "write", "maintain"]);

export async function hasRepoWriteAccess(token: string): Promise<boolean> {
  try {
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    };

    const userRes = await fetch("https://api.github.com/user", { headers: authHeaders });
    if (!userRes.ok) return false;
    const user = (await userRes.json()) as { login?: string };
    if (!user.login) return false;

    const permRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${encodeURIComponent(user.login)}/permission`,
      { headers: authHeaders },
    );
    if (!permRes.ok) return false;
    const body = (await permRes.json()) as { permission?: string };
    return !!body.permission && WRITE_PERMISSIONS.has(body.permission);
  } catch {
    return false;
  }
}
