import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skills from "./Skills";
import type { SkillCategory } from "@/lib/types";

describe("Skills", () => {
  it("renders every category from the fixture, dropping none silently (STORY-2.3 AC2)", () => {
    const categories: SkillCategory[] = [
      { name: "Frontend", icon: "bi-1", skills: ["React.js"] },
      { name: "Backend", icon: "bi-2", skills: ["Node.js", "LangChain", "LangGraph"] },
      { name: "Databases", icon: "bi-3", skills: ["MongoDB", "Databricks"] },
      { name: "Languages", icon: "bi-4", skills: ["Python"] },
      { name: "Tools", icon: "bi-5", skills: ["MCP / Claude Code Tooling"] },
      { name: "Concepts", icon: "bi-6", skills: ["Multi-Agent Orchestration"] },
    ];
    render(<Skills categories={categories} />);
    categories.forEach((c) => expect(screen.getByText(c.name)).toBeInTheDocument());
    expect(screen.getByText(/LangChain/)).toBeInTheDocument();
    expect(screen.getByText(/React\.js/)).toBeInTheDocument();
  });
});
