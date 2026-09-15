import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Wires up `@next/mdx` (ADR-003) so `.mdx` files under `content/projects/`
 * and any future `app/**\/*.mdx` page compile as part of the normal SSG
 * build — an invalid MDX file fails `next build` loudly (STORY-1.4 AC2)
 * rather than silently producing a broken page, since no error-swallowing
 * logic wraps the compile step (see ADR-003's mitigation note).
 * `rehype-highlight` provides syntax highlighting for fenced code blocks
 * (STORY-1.4 AC1) via `components/mdx/CodeBlock.tsx`.
 */
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeHighlight],
  },
});

export default withMDX(nextConfig);
