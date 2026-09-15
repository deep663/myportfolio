interface CTALinkProps {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}

/**
 * Shared "pill" button/link — replaces the legacy "Get in touch" /
 * "GitHub" / "View on GitHub" markup pattern (`legacy-website/index.html`)
 * with one reusable component. Pure presentational Server Component.
 *
 * @param href - the link target (mailto:, https://, or an in-page anchor)
 * @param label - visible link text
 * @param icon - a bootstrap-icons class name (e.g. "bi-arrow-up-right")
 * @param external - when true, opens in a new tab with rel="noopener noreferrer"
 */
export default function CTALink({ href, label, icon, external = false }: CTALinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex h-[40px] items-center gap-2 rounded-full border border-solid border-black bg-white pl-4 pr-1 text-black transition-colors duration-500 hover:bg-black hover:text-white"
    >
      <span>{label}</span>
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black font-semibold text-white transition-colors duration-500 group-hover:bg-[var(--accent-amber)] group-hover:text-black">
        <i className={`bi ${icon}`}></i>
      </span>
    </a>
  );
}
