import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

/**
 * STORY-4.2 — Decap `config.yml` ↔ `lib/types.ts` schema-parity check
 * (TS-001 §6.2, a blocking CI gate per §9). `lib/types.ts` interfaces are
 * erased at runtime, so this asserts `config.yml`'s declared field names
 * against a small hand-maintained expected-field map kept in sync with
 * `lib/types.ts` by code review — flagged here, not hidden, since that's
 * the practical limit of a runtime check against compile-time-only types.
 */

type YamlField = { name: string; required?: boolean; fields?: YamlField[] };
type YamlCollection = {
  name: string;
  file?: string;
  folder?: string;
  fields: YamlField[];
};
type YamlConfig = {
  backend: { name: string; branch: string };
  publish_mode: string;
  collections: YamlCollection[];
};

const CONFIG_PATH = path.join(process.cwd(), "public/admin/config.yml");

function loadConfig(): YamlConfig {
  return yaml.load(fs.readFileSync(CONFIG_PATH, "utf-8")) as YamlConfig;
}

// Expected fields per Positioning/Experience/Certifications interface
// (lib/types.ts) — top-level or, for list collections, nested item fields.
const EXPECTED: Record<string, string[]> = {
  positioning: ["headline", "metaTitle", "metaDescription", "aboutNarrative"],
  experience: ["org", "role", "badge", "start", "end", "description"],
  certifications: ["issuer", "headerBg", "icon", "title", "description"],
  projects: [
    "slug",
    "order",
    "title",
    "category",
    "icon",
    "type",
    "tags",
    "description",
    "githubUrl",
  ],
};

describe("public/admin/config.yml ↔ lib/types.ts schema parity (STORY-4.2)", () => {
  const config = loadConfig();
  const byName = Object.fromEntries(config.collections.map((c) => [c.name, c]));

  it("declares all 5 required collections", () => {
    expect(Object.keys(byName).sort()).toEqual(
      ["certifications", "experience", "positioning", "projects", "skills"].sort(),
    );
  });

  it.each(Object.entries(EXPECTED))("%s collection fields match lib/types.ts", (name, expectedFields) => {
    const collection = byName[name];
    const fields =
      name === "experience" || name === "certifications"
        ? (collection.fields[0].fields ?? [])
        : collection.fields;
    // "body" (projects only) is the CMS's MDX case-study content field —
    // maps to `getProjectBySlug()`'s returned `content`, not a `Project`
    // interface field (`hasCaseStudy` is derived from it, not stored),
    // so it's intentionally excluded from this frontmatter-shape check.
    const actualNames = fields.map((f) => f.name).filter((n) => n !== "body").sort();
    expect(actualNames).toEqual([...expectedFields].sort());
  });

  it("skills collection's nested category/skill fields match SkillCategory", () => {
    const categoryFields = byName.skills.fields[0].fields ?? [];
    expect(categoryFields.map((f) => f.name).sort()).toEqual(["icon", "name", "skills"]);
  });

  it("marks every required field per lib/types.ts as required: true (no orphaned optional field)", () => {
    const project = byName.projects;
    const requiredOnProject = project.fields
      .filter((f) => f.name !== "tags" && f.name !== "body")
      .every((f) => f.required === true);
    expect(requiredOnProject).toBe(true);
    expect(project.fields.find((f) => f.name === "tags")?.required).toBe(false);
  });

  it("STORY-4.3: publish_mode is simple (direct-to-main, no editorial workflow) per approved risk A7", () => {
    expect(config.publish_mode).toBe("simple");
    expect(config.backend.name).toBe("github");
    expect(config.backend.branch).toBe("main");
  });
});
