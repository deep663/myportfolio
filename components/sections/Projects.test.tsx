import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";
import type { Project } from "@/lib/types";

const base: Omit<Project, "slug" | "order" | "title"> = {
  category: "cat",
  icon: "bi-robot",
  type: "type",
  tags: [],
  description: "desc",
  githubUrl: "https://github.com/x",
  hasCaseStudy: false,
};

describe("Projects", () => {
  it("renders cards in the given array order (EVA first per STORY-3.1)", () => {
    const projects: Project[] = [
      { ...base, slug: "eva", order: 1, title: "EVA – AI Personal Assistant" },
      { ...base, slug: "videotube", order: 2, title: "VideoTube Backend" },
    ];
    render(<Projects projects={projects} />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(["EVA – AI Personal Assistant", "VideoTube Backend"]);
  });

  it("does not render removed legacy projects (STORY-3.3)", () => {
    const projects: Project[] = [
      { ...base, slug: "eva", order: 1, title: "EVA – AI Personal Assistant" },
      { ...base, slug: "videotube", order: 2, title: "VideoTube Backend" },
    ];
    render(<Projects projects={projects} />);
    expect(screen.queryByText("Job Finder")).not.toBeInTheDocument();
    expect(screen.queryByText("Contact Management API")).not.toBeInTheDocument();
    expect(screen.queryByText("Academic Management System")).not.toBeInTheDocument();
  });

  it("renders exactly one card per project entry", () => {
    const projects: Project[] = [
      { ...base, slug: "eva", order: 1, title: "EVA" },
      { ...base, slug: "videotube", order: 2, title: "VideoTube" },
    ];
    render(<Projects projects={projects} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });
});
