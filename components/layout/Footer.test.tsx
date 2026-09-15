import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders contact details and social links unchanged from the legacy site", () => {
    render(<Footer />);
    expect(screen.getByText(/deepsenchowa1@gmail.com/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Github" })).toHaveAttribute("href", "https://github.com/deep663");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/deepsenchowa",
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:deepsenchowa1@gmail.com",
    );
  });
});
