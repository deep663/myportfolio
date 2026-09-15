import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project } from "./types";

/**
 * `content/projects/*.mdx` loaders — split out of `lib/content.ts` (TS-001
 * §3's pre-approved split point) once the shared JSON-loaders + this
 * file's frontmatter-parsing/validation logic no longer comfortably fit
 * in one ≤100-line module together. Same "loud failure" contract:
 * a missing required frontmatter field throws a file-identifying error
 * (ADR-006 Risks table) rather than silently dropping a project card.
 *
 * COMPONENT-SIZE-JUSTIFICATION: ~66 lines, over the 50-line target but
 * comfortably under the 100-line ceiling — one cohesive frontmatter-
 * validation helper plus the two loaders that share it (`getProjects`,
 * `getProjectBySlug`), including the SEC-011 slug guard. Splitting the
 * single validation helper further would separate code that must change
 * together (the required-fields list and the error it produces).
 */

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");
const REQUIRED_FIELDS = [
  "slug",
  "order",
  "title",
  "category",
  "icon",
  "type",
  "tags",
  "description",
  "githubUrl",
] as const;

function parseProjectFile(filename: string, dir: string): { project: Project; content: string } {
  const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
  const { data, content } = matter(raw);
  const missing = REQUIRED_FIELDS.filter((key) => data[key] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `content/projects/${filename} is missing required frontmatter field(s): ${missing.join(", ")}`,
    );
  }
  const project = { ...data, hasCaseStudy: data.hasCaseStudy ?? false } as Project;
  return { project, content: content.trim() };
}

export function getProjects(dir: string = PROJECTS_DIR): Project[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`content/projects directory not found at ${dir}`);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseProjectFile(f, dir).project)
    .sort((a, b) => a.order - b.order);
}

/**
 * SEC-011 note: `slug` is rejected unless it's a plain filename segment
 * before it ever reaches a filesystem path — defense-in-depth alongside
 * the route-level `dynamicParams = false` guard in
 * `app/projects/[slug]/page.tsx`.
 */
export function getProjectBySlug(
  slug: string,
  dir: string = PROJECTS_DIR,
): { project: Project; content: string } | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const filename = `${slug}.mdx`;
  if (!fs.existsSync(path.join(dir, filename))) return null;
  return parseProjectFile(filename, dir);
}
