import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Certifications from "./Certifications";
import type { Certification } from "@/lib/types";

describe("Certifications", () => {
  it("renders one card per certification entry", () => {
    const entries: Certification[] = [
      { issuer: "A", headerBg: "#000", icon: "bi-1", title: "Title A", description: "Desc A" },
      { issuer: "B", headerBg: "#111", icon: "bi-2", title: "Title B", description: "Desc B" },
    ];
    render(<Certifications entries={entries} />);
    expect(screen.getByText("Title A")).toBeInTheDocument();
    expect(screen.getByText("Title B")).toBeInTheDocument();
  });
});
