import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import type { Positioning } from "@/lib/types";

const positioning: Positioning = {
  headline: "Backend & AI Systems Engineer — building agentic pipelines, semantic layers, and enterprise AI tooling",
  metaTitle: "Deep Senchowa – Backend & AI Systems Engineer",
  metaDescription: "desc",
  aboutNarrative: ["p1", "p2"],
};

describe("Hero", () => {
  it("renders the headline from the Positioning fixture, content-agnostic to the exact copy", () => {
    render(<Hero positioning={positioning} />);
    expect(screen.getByText(new RegExp(positioning.headline))).toBeInTheDocument();
  });

  it("never renders the string 'Full Stack' in the headline (STORY-2.1 AC1)", () => {
    render(<Hero positioning={positioning} />);
    expect(screen.queryByText(/Full Stack/)).not.toBeInTheDocument();
  });
});
