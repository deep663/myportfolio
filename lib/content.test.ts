import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  getPositioning,
  getExperience,
  getSkillCategories,
  getCertifications,
  getProjects,
  getProjectBySlug,
} from "./content";

// TS-001 §2/§6: lib/content.ts is the one real filesystem I/O boundary in
// the system; covers every loud-failure branch (missing dir, missing
// frontmatter field) using real temp-fixture files on disk, per the
// "temp-fixture-directory pattern" the test strategy names for this layer.

function makeTmpProjectsDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "content-test-"));
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body, "utf-8");
  }
  return dir;
}

const VALID_FRONTMATTER = `---
slug: eva
order: 1
title: EVA
category: "01 / AI"
icon: bi-robot
type: CLI Tool
tags: ["Python"]
description: An assistant.
githubUrl: https://github.com/deep663/AI-PA-V1
hasCaseStudy: false
---
`;

describe("lib/content.ts — JSON-backed loaders (site-copy, experience, skills, certifications)", () => {
  it("getPositioning returns the real content/site-copy.json shape", () => {
    const positioning = getPositioning();
    expect(typeof positioning.headline).toBe("string");
    expect(Array.isArray(positioning.aboutNarrative)).toBe(true);
  });

  it("getExperience returns the real content/experience.json entries array", () => {
    const experience = getExperience();
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);
  });

  it("getSkillCategories returns the real content/skills.json categories array", () => {
    const categories = getSkillCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("getCertifications returns the real content/certifications.json entries array", () => {
    const certifications = getCertifications();
    expect(Array.isArray(certifications)).toBe(true);
  });
});

describe("lib/content.ts — getProjects (filesystem + frontmatter parsing)", () => {
  let tmpDir: string | undefined;

  afterEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = undefined;
  });

  it("parses valid frontmatter and sorts by order ascending", () => {
    tmpDir = makeTmpProjectsDir({
      "b.mdx": VALID_FRONTMATTER.replace("order: 1", "order: 2").replace("slug: eva", "slug: b"),
      "a.mdx": VALID_FRONTMATTER,
    });
    const projects = getProjects(tmpDir);
    expect(projects).toHaveLength(2);
    expect(projects[0].slug).toBe("eva");
    expect(projects[1].slug).toBe("b");
  });

  it("throws a file-identifying error when a required frontmatter field is missing", () => {
    tmpDir = makeTmpProjectsDir({
      "broken.mdx": "---\nslug: broken\norder: 1\n---\n",
    });
    expect(() => getProjects(tmpDir)).toThrow(/broken\.mdx/);
  });

  it("throws when the projects directory does not exist", () => {
    expect(() => getProjects("/nonexistent/content/projects")).toThrow(/not found/);
  });

  it("defaults hasCaseStudy to false when the frontmatter field is omitted", () => {
    const noHasCaseStudy = VALID_FRONTMATTER.replace("hasCaseStudy: false\n", "");
    tmpDir = makeTmpProjectsDir({ "eva.mdx": noHasCaseStudy });
    expect(getProjects(tmpDir)[0].hasCaseStudy).toBe(false);
  });

  it("ignores non-.mdx files in the projects directory", () => {
    tmpDir = makeTmpProjectsDir({
      "a.mdx": VALID_FRONTMATTER,
      "README.md": "not a project",
    });
    expect(getProjects(tmpDir)).toHaveLength(1);
  });
});

describe("lib/content.ts — getProjectBySlug", () => {
  let tmpDir: string | undefined;

  afterEach(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    tmpDir = undefined;
  });

  it("returns the project and raw MDX body content for an existing slug", () => {
    tmpDir = makeTmpProjectsDir({ "eva.mdx": VALID_FRONTMATTER + "\nSome case study body.\n" });
    const result = getProjectBySlug("eva", tmpDir);
    expect(result).not.toBeNull();
    expect(result?.project.slug).toBe("eva");
    expect(result?.content).toContain("Some case study body.");
  });

  it("returns null for a slug with no matching file", () => {
    tmpDir = makeTmpProjectsDir({ "eva.mdx": VALID_FRONTMATTER });
    expect(getProjectBySlug("missing", tmpDir)).toBeNull();
  });

  it("rejects a path-traversal slug instead of reading outside the projects dir (SEC-011)", () => {
    tmpDir = makeTmpProjectsDir({ "eva.mdx": VALID_FRONTMATTER });
    expect(getProjectBySlug("../../etc/passwd", tmpDir)).toBeNull();
    expect(getProjectBySlug("..%2f..%2fetc%2fpasswd", tmpDir)).toBeNull();
  });
});
