/**
 * Domain type definitions for deep-portfolio content.
 *
 * Shapes match `A02-Solution-Achitecture/02-nextjs-project-structure.md`
 * §5 and the business entities named in `.claude/rules/business-domain.md`
 * (Project, Experience, Skill, Positioning). Content is modeled as typed
 * data per ADR-005 (typed-data rationale) / ADR-006 (JSON + MDX-frontmatter
 * storage format) so section components stay pure maps over these shapes.
 *
 * No runtime logic lives here — pure type declarations, not unit-tested
 * directly; the loaders in `lib/content.ts` that produce values of these
 * shapes are what get tested.
 */

export interface Positioning {
  headline: string;
  metaTitle: string;
  metaDescription: string;
  aboutNarrative: string[];
}

export interface Project {
  slug: string;
  order: number;
  title: string;
  category: string;
  icon: string;
  type: string;
  tags: string[];
  description: string;
  githubUrl: string;
  hasCaseStudy: boolean;
}

export interface Experience {
  org: string;
  role: string;
  badge: string;
  start: string;
  end: string;
  description: string;
}

export type SkillCategoryName =
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Languages"
  | "Tools"
  | "Concepts";

export interface SkillCategory {
  name: SkillCategoryName;
  icon: string;
  skills: string[];
}

export interface Certification {
  issuer: string;
  headerBg: string;
  icon: string;
  title: string;
  description: string;
}
