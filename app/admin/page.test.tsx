import { describe, it, expect, vi } from "vitest";

// STORY-4.1 AC1/AC3: `/admin` is a routable path that hands off to the
// static Decap bundle (`public/admin/index.html`) with zero React
// component tree / data fetching of its own — per
// `07-cms-architecture.md` §1-2, this is what keeps the admin bundle out
// of the public-route JS bundle (AC3) and matches TS-001 §3's note that
// this route's only testable surface is "does it hand off correctly."

const redirectMock = vi.fn(() => {
  throw new Error("NEXT_REDIRECT");
});
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

describe("app/admin/page.tsx", () => {
  it("redirects to the static Decap CMS bundle, not a rendered React form", async () => {
    const { default: AdminPage } = await import("./page");
    expect(() => AdminPage()).toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/admin/index.html");
  });
});
