import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechIcon from "./TechIcon";

describe("TechIcon", () => {
  it("renders an <i> element carrying the given devicon class and title", () => {
    render(<TechIcon iconClass="devicon-react-original" title="React" />);
    const icon = screen.getByTitle("React");
    expect(icon.tagName).toBe("I");
    expect(icon).toHaveClass("devicon-react-original");
  });
});
