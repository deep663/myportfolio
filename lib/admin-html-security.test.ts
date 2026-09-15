import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// SEC-004 (Low, CWE-829) regression tests — audit-20260915-feature-04-cms.md.
// public/admin/index.html loads decap-cms-app from a CDN with no SRI and
// no CSP; both must be present so a compromised CDN/package cannot serve
// arbitrary script into the admin origin unnoticed/unrestricted.

const ADMIN_HTML_PATH = path.join(process.cwd(), "public/admin/index.html");

function loadAdminHtml(): string {
  return fs.readFileSync(ADMIN_HTML_PATH, "utf-8");
}

describe("public/admin/index.html security hardening", () => {
  it("pins the decap-cms-app script tag with an SRI integrity attribute", () => {
    const html = loadAdminHtml();
    const scriptTagMatch = html.match(/<script[^>]*unpkg\.com\/decap-cms-app[^>]*>/);
    expect(scriptTagMatch).not.toBeNull();
    const scriptTag = scriptTagMatch![0];
    expect(scriptTag).toMatch(/integrity="sha384-[^"]+"/);
    expect(scriptTag).toContain('crossorigin="anonymous"');
  });

  it("declares a CSP meta tag restricting script-src to self and the pinned CDN host", () => {
    const html = loadAdminHtml();
    const cspMatch = html.match(
      /<meta[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/,
    );
    expect(cspMatch).not.toBeNull();
    const policy = cspMatch![1];
    expect(policy).toMatch(/script-src[^;]*'self'/);
    expect(policy).toMatch(/script-src[^;]*unpkg\.com/);
  });
});
