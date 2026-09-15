import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Reveal from "./Reveal";

let ioCallback: IntersectionObserverCallback | undefined;
let disconnectSpy: ReturnType<typeof vi.fn>;

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    ioCallback = cb;
  }
  observe = vi.fn();
  disconnect = disconnectSpy = vi.fn();
  unobserve = vi.fn();
}

// ADR-001 / TS-001 §3: this is a negative-space test — the contract being
// proven is that children are present and visible in the DOM *before* any
// IntersectionObserver/JS enhancement runs, not that the reveal animation
// itself plays. A visible-by-default default state is what structurally
// prevents the legacy `#loader` permanent-content-block defect (ADR-001)
// from being reintroduced here.
describe("Reveal", () => {
  it("renders children visible by default, with no opacity-0/hidden class applied", () => {
    render(
      <Reveal>
        <p>Section content</p>
      </Reveal>,
    );
    const content = screen.getByText("Section content");
    expect(content).toBeVisible();
    expect(content.closest("div")).not.toHaveClass("opacity-0");
  });

  it("content remains in the accessibility tree even without IntersectionObserver support", () => {
    const original = window.IntersectionObserver;
    // @ts-expect-error — simulate an environment without IO (no-JS-equivalent for this concern)
    delete window.IntersectionObserver;
    render(
      <Reveal>
        <p>No-IO content</p>
      </Reveal>,
    );
    expect(screen.getByText("No-IO content")).toBeVisible();
    window.IntersectionObserver = original;
  });

  it("adds the revealed finishing-touch class once IntersectionObserver reports intersection", () => {
    const original = window.IntersectionObserver;
    // @ts-expect-error — test double
    window.IntersectionObserver = MockIntersectionObserver;

    const { container } = render(
      <Reveal>
        <p>Observed content</p>
      </Reveal>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("opacity-90");

    act(() => {
      ioCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(wrapper.className).toContain("opacity-100");
    expect(disconnectSpy).toHaveBeenCalled();

    window.IntersectionObserver = original;
  });
});
