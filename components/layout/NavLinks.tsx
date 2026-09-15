const LINKS = [
  { href: "#about", label: "About Me" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

/**
 * Pure `<a href="#...">` nav-link list, shared by desktop/mobile render.
 * No interactivity — `Header.tsx` owns open/close state around this.
 *
 * Anchor remapping (`03-legacy-migration-mapping.md` §2): "About Me" now
 * targets `#about` on the new About section (STORY-2.2), not the Hero —
 * the legacy site mislabeled Hero as `#about` since it had no distinct
 * About content.
 */
export default function NavLinks() {
  return (
    <>
      {LINKS.map((link) => (
        <a key={link.href} className="header-links" href={link.href}>
          {link.label}
        </a>
      ))}
    </>
  );
}
