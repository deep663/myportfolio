import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";

const project: Project = {
  slug: "eva",
  order: 1,
  title: "EVA – AI Personal Assistant",
  category: "01 / AI",
  icon: "bi-robot",
  type: "CLI Tool",
  tags: ["Python", "LangChain", "LangGraph"],
  description: "CLI-based AI assistant.",
  githubUrl: "https://github.com/deep663/AI-PA-V1",
  hasCaseStudy: false,
};

describe("ProjectCard", () => {
  it("renders title, category, type badge, tags, description, and GitHub link", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.category)).toBeInTheDocument();
    expect(screen.getByText(project.type)).toBeInTheDocument();
    project.tags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
    expect(screen.getByText(project.description)).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: /view on github|github/i });
    expect(links[0]).toHaveAttribute("href", project.githubUrl);
  });
});
