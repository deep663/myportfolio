import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";
import type { Experience as ExperienceEntry } from "@/lib/types";

describe("Experience", () => {
  it("renders one card per entry, preserving array order (incl. intentional date overlaps)", () => {
    const entries: ExperienceEntry[] = [
      { org: "A Corp", role: "Role A", badge: "A", start: "Jan 2025", end: "Present", description: "d1" },
      { org: "B Corp", role: "Role B", badge: "B", start: "Feb 2024", end: "Mar 2025", description: "d2" },
    ];
    render(<Experience entries={entries} />);
    const orgs = screen.getAllByText(/Corp/).map((el) => el.textContent);
    expect(orgs).toEqual(["A Corp", "B Corp"]);
  });
});
