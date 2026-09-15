import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About", () => {
  it("renders every narrative paragraph as prose (not a bullet list)", () => {
    const narrative = ["First paragraph about MERN foundations.", "Second paragraph about agentic AI work."];
    render(<About narrative={narrative} />);
    narrative.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders each paragraph as its own <p>, distinct from a single blob", () => {
    const narrative = ["Para one.", "Para two."];
    const { container } = render(<About narrative={narrative} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});
