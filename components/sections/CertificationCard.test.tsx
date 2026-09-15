import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CertificationCard from "./CertificationCard";
import type { Certification } from "@/lib/types";

const cert: Certification = {
  issuer: "TCS NQT",
  headerBg: "#000000",
  icon: "bi-patch-check-fill",
  title: "TCS National Qualifier Test (IT)",
  description: "Jan 2026 · Programming (Python): 100%",
};

describe("CertificationCard", () => {
  it("renders issuer, title, and description", () => {
    render(<CertificationCard certification={cert} />);
    expect(screen.getByText(cert.issuer)).toBeInTheDocument();
    expect(screen.getByText(cert.title)).toBeInTheDocument();
    expect(screen.getByText(cert.description)).toBeInTheDocument();
  });
});
