import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import CodeBlock from "@/components/mdx/CodeBlock";

/**
 * Required at repo root by `@next/mdx`'s App Router integration
 * (ADR-003) — maps MDX-compiled HTML elements to React components for
 * every `.mdx` file in the project. `pre` renders through `CodeBlock`
 * (STORY-1.4 AC1, syntax highlighting via `rehype-highlight`). `img` uses
 * `next/image` with `w-full h-auto`, scaling embedded diagrams/images to
 * fit the viewport at phone width without horizontal scroll (STORY-1.4
 * AC3).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: CodeBlock,
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        className="h-auto w-full"
        alt={props.alt ?? ""}
        width={800}
        height={450}
      />
    ),
    ...components,
  };
}
