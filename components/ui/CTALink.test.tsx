import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CTALink from "./CTALink";

describe("CTALink", () => {
  it("renders the label and links to the given href", () => {
    render(<CTALink href="mailto:test@example.com" label="Get in touch" icon="bi-arrow-up-right" />);
    const link = screen.getByRole("link", { name: /get in touch/i });
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("opens external links in a new tab when external is true", () => {
    render(<CTALink href="https://github.com/deep663" label="GitHub" icon="bi-github" external />);
    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("does not set target=_blank for internal links", () => {
    render(<CTALink href="#contact" label="Contact" icon="bi-arrow-up-right" />);
    expect(screen.getByRole("link", { name: /contact/i })).not.toHaveAttribute("target");
  });
});
