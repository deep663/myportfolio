import { redirect } from "next/navigation";

/**
 * STORY-4.1 — the `/admin` route Deep Senchowa navigates to. Deliberately
 * not a React component tree with a data-fetch/render cycle: it exists
 * only to give the Decap CMS static bundle (`public/admin/index.html`,
 * `public/admin/config.yml`) a routable path inside the Next.js app, per
 * `07-cms-architecture.md` §1-2. Redirecting (rather than rendering
 * Decap inline) means `/admin` shares zero JS chunks with any public
 * route — the structural guarantee behind STORY-4.1 AC Scenario 3 (the
 * admin bundle does not affect public-page load performance).
 */
export default function AdminPage(): never {
  redirect("/admin/index.html");
}
