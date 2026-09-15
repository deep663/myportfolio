import type { ReactNode } from "react";

/**
 * MDX `pre` override used by `mdx-components.tsx` — renders fenced code
 * blocks. `rehype-highlight` (wired in `next.config.ts`) adds `hljs`/
 * `language-*` classes to the inner `<code>` at build time for syntax
 * highlighting (STORY-1.4 AC1). `overflow-x-auto` keeps a long code line
 * scrollable within the block itself rather than causing page-level
 * horizontal scroll at phone width (STORY-1.4 AC3).
 *
 * @param children - the compiled `<code>` element MDX passes through
 */
export default function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm text-gray-100">
      {children}
    </pre>
  );
}
