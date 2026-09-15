import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPositioning } from "@/lib/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

/**
 * Root layout — `<html>`/`<body>`, self-hosted Space Grotesk (display/body)
 * + JetBrains Mono (the site's existing tag/badge/index monospace accents,
 * `app/globals.css`'s `--font-mono`) fonts, replacing both the legacy
 * render-blocking Google Fonts `@import` and the generic Roboto/browser-
 * default-monospace pairing (`03-legacy-migration-mapping.md` §4). Also
 * carries page-wide `<title>`/Open Graph metadata sourced from
 * `content/site-copy.json` via `lib/content.ts` (STORY-2.1 AC2 — metadata
 * matches the new Backend & AI Systems Engineer positioning, not the
 * legacy "Full Stack Developer" copy). Renders `Header`/`Footer` around
 * `{children}`; section content lives entirely in `app/page.tsx`.
 */
export function generateMetadata(): Metadata {
  const positioning = getPositioning();
  return {
    title: positioning.metaTitle,
    description: positioning.metaDescription,
    openGraph: {
      title: positioning.metaTitle,
      description: positioning.metaDescription,
      type: "website",
      url: "https://github.com/deep663",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
