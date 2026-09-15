import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/content";

/**
 * MDX case-study page (STORY-1.4 routing capability). Static params come
 * from `content/projects/*.mdx` entries with `hasCaseStudy: true` — today
 * that set is empty (no case study exists yet, deferred per EPIC-01), so
 * this returns `[]` and the route builds zero pages, per
 * `02-nextjs-project-structure.md` §2's documented "empty set" note.
 * Full MDX-body-to-JSX rendering is left for when real case-study content
 * lands (out of this session's scope) — this route proves the capability
 * exists and is buildable without dead-ending in a runtime error.
 *
 * `dynamicParams = false` enforces ADR-002's full-SSG-only decision (no
 * SSR/on-demand fallback for this route) and is also a deliberate
 * SEC-011 (path traversal) guard: `getProjectBySlug` joins `slug` into a
 * filesystem path, so without this, an un-pre-rendered slug would reach
 * that lookup at request time with attacker-controlled input instead of
 * 404ing before the loader ever runs.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects()
    .filter((p) => p.hasCaseStudy)
    .map((p) => ({ slug: p.slug }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = getProjectBySlug(slug);
  if (!result || !result.project.hasCaseStudy) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-4xl font-semibold">{result.project.title}</h1>
      <div className="prose mt-6">{result.content}</div>
    </main>
  );
}
