import type { Positioning, Experience, SkillCategory, Certification } from "./types";
import siteCopy from "@/content/site-copy.json";
import experienceData from "@/content/experience.json";
import skillsData from "@/content/skills.json";
import certificationsData from "@/content/certifications.json";

/**
 * Typed content loaders — the system's one real filesystem I/O boundary
 * (TS-001 §1/§6). These four loaders read statically-imported
 * `content/*.json` modules, so a malformed file fails the build itself.
 * `content/projects/*.mdx` loaders (real fs + frontmatter parsing, more
 * failure-mode complexity) live in `lib/content-projects.ts` — split out
 * to keep each module comfortably under the 100-line ceiling, and
 * re-exported here so `lib/content.ts` stays the one import path for all
 * content.
 */

export function getPositioning(): Positioning {
  return siteCopy as Positioning;
}

export function getExperience(): Experience[] {
  return (experienceData as { entries: Experience[] }).entries;
}

export function getSkillCategories(): SkillCategory[] {
  return (skillsData as { categories: SkillCategory[] }).categories;
}

export function getCertifications(): Certification[] {
  return (certificationsData as { entries: Certification[] }).entries;
}

export { getProjects, getProjectBySlug } from "./content-projects";
