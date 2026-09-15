# Deployment Handoff — deep-portfolio

Package: `deep-portfolio_20260915_c663f6d.zip` (commit `c663f6d`, `main`)

This is a Next.js (App Router) site with a git-based CMS (Decap CMS +
GitHub OAuth) baked in. The app code is done and security-reviewed; the
items below are what's left to make it actually run in production.

## 1. Install & build

```
npm install
npm run build
npm start        # or deploy to Vercel — see below
```

No database, no external services beyond GitHub and (optionally) Vercel.

## 2. Required environment variables

Set these wherever the site is hosted (Vercel → Project → Settings →
Environment Variables, or your platform's equivalent):

| Variable | Value | Notes |
|---|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | from the GitHub OAuth App (step 3) | server-only, never exposed to the client |
| `GITHUB_OAUTH_CLIENT_SECRET` | from the GitHub OAuth App (step 3) | server-only — verified in security audit to never reach client bundles |
| `NEXT_PUBLIC_SITE_URL` | the site's real deployed URL, e.g. `https://deepsenchowa.dev` | **the app fails closed without this in production** (SEC-005 fix) — don't skip it |

## 3. Create the GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.

- **Homepage URL**: the deployed site URL
- **Authorization callback URL**: `<deployed-site-url>/api/callback`
- Turn on **"Enable expiring user access tokens"** — this is what gives
  the 8-hour absolute session expiry the architecture assumes (ADR-007)
- Copy the generated Client ID / Client Secret into the env vars above

The GitHub account used to log into the CMS afterward must have **write
access to this repository** — that's the actual authorization check
(`lib/github-repo-access.ts`), not a separate allow-list.

## 4. Deploy (Vercel, per ADR-004)

- Import the repo/zip contents into a new Vercel project
- Framework preset: Next.js (auto-detected)
- Add the env vars from step 2
- Deploy — every push to `main` (including CMS-triggered commits)
  auto-redeploys

If deploying to something other than Vercel, `05-deployment-architecture.md`
in the package documents the intended topology; the build itself is
platform-agnostic Next.js.

## 5. Known open items — do these before real content goes through the CMS

- **SRI hash placeholder**: `public/admin/index.html` has a `TODO(Deep
  Senchowa)` where a real Subresource Integrity hash for the CDN-loaded
  `decap-cms-app@3.7.2` script should go. Compute it (`openssl dgst -sha384
  -binary <file> | openssl base64 -A`) against the actual served file and
  fill it in.
- **decap-cms-app version risk (SEC-003, unresolved)**: pinned version
  3.7.2 is behind latest (3.15.1) and inside the affected range of
  CVE-2025-57520 (stored XSS in the admin preview panel, no upstream fix
  yet). This needs a product-owner risk decision, not a default action —
  see `.sdlc/security-scans/audit-20260915-feature-04-cms.md` for detail.
  Options: accept the risk for a solo-editor low-traffic site, pin to a
  newer version once one exists, or swap the CMS admin approach entirely.
- **Domain/DNS**: not yet decided anywhere in this repo (STORY-1.3 is
  still open) — needs to be pointed at the Vercel deployment once live.

## 6. Accessing the CMS once deployed

1. Go to `<deployed-site-url>/admin`
2. Click "Login with GitHub" → GitHub consent screen → redirected back
3. App verifies GitHub repo write-access before granting a session
   (fails closed on any error or insufficient permission)
4. Edit any of the 5 content collections (Positioning, Skills, Projects,
   Experience, Certifications) and Save
5. Save = a direct commit to `main` (`publish_mode: simple`, no draft
   step) → Vercel auto-redeploys, live in a minute or two

## Reference docs in the package

- `A02-Solution-Achitecture/` — full system/CMS architecture + all ADRs
- `.sdlc/test-strategies/TS-001-*.md` — test strategy
- `.sdlc/security-scans/audit-20260915-feature-04-cms.md` — full security
  audit (1 High + 2 Medium fixed, SEC-003 still open per above)
- `.sdlc/requirements/` — original requirements/stories, for context on
  what shipped and why
