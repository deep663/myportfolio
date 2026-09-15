import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CodeBlock from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders children inside a styled <pre> for syntax-highlighted code (STORY-1.4 AC1)", () => {
    const { container } = render(
      <CodeBlock>
        <code className="hljs language-ts">const x = 1;</code>
      </CodeBlock>,
    );
    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe("const x = 1;");
  });

  it("allows horizontal scroll on the block itself instead of the page (phone-width safety, STORY-1.4 AC3)", () => {
    const { container } = render(
      <CodeBlock>
        <code>a very long line of code that could overflow</code>
      </CodeBlock>,
    );
    expect(container.querySelector("pre")).toHaveClass("overflow-x-auto");
  });
});
