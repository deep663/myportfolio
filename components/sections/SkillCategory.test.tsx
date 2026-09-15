import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillCategory from "./SkillCategory";
import type { SkillCategory as SkillCategoryType } from "@/lib/types";

const category: SkillCategoryType = {
  name: "Backend",
  icon: "bi-server",
  skills: ["Node.js", "FastAPI", "LangChain"],
};

describe("SkillCategory", () => {
  it("renders the category name and every skill entry", () => {
    render(<SkillCategory category={category} />);
    expect(screen.getByText("Backend")).toBeInTheDocument();
    category.skills.forEach((skill) => expect(screen.getByText(new RegExp(skill))).toBeInTheDocument());
  });
});
