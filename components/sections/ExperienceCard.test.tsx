import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExperienceCard from "./ExperienceCard";
import type { Experience } from "@/lib/types";

const entry: Experience = {
  org: "TrieDatum Inc.",
  role: "Software Engineer",
  badge: "TDI",
  start: "Apr 2026",
  end: "Present",
  description: "Contributing to production-grade AI solutions.",
};

describe("ExperienceCard", () => {
  it("renders role, org, badge, dates, and description", () => {
    render(<ExperienceCard entry={entry} />);
    expect(screen.getByText(entry.role)).toBeInTheDocument();
    expect(screen.getByText(entry.org)).toBeInTheDocument();
    expect(screen.getByText(entry.badge)).toBeInTheDocument();
    expect(screen.getByText(`${entry.start} – ${entry.end}`)).toBeInTheDocument();
    expect(screen.getByText(entry.description)).toBeInTheDocument();
  });
});
