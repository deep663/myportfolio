import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

// TS-001 §3: Header.tsx is the one component in the tree with real
// interaction state to test (open/close + click-outside), replacing the
// legacy toggleHeader()/onHeaderClickOutside() imperative DOM code
// (STORY-1.2 AC Scenario 2) with React state.
describe("Header", () => {
  it("starts closed (nav menu not expanded)", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the nav when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the nav when the toggle button is clicked again", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the nav when a click happens outside the nav panel", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Header />
        <div data-testid="outside">outside content</div>
      </div>,
    );
    const toggle = screen.getByRole("button", { name: /menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByTestId("outside"));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
