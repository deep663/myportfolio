import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NavLinks from "./NavLinks";

describe("NavLinks", () => {
  it("renders About Me, Projects, Experience, Contact anchors targeting the remapped ids", () => {
    render(<NavLinks />);
    expect(screen.getByRole("link", { name: "About Me" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "#experience");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  });
});
