/**
 * Site footer — contact details + social links, ported verbatim from
 * `legacy-website/index.html` (lines 700-725, `03-legacy-migration-mapping.md`
 * §5: "Footer contact details and social links" preserved with no content
 * changes needed).
 */
export default function Footer() {
  return (
    <footer className="mt-auto flex min-h-[100px] w-full flex-wrap items-center justify-around gap-3 px-[10%] py-[2%] text-black">
      <p className="text-sm text-gray-500">deepsenchowa1@gmail.com · +91-9954709932</p>
      <div className="flex gap-6 text-2xl">
        <a href="https://github.com/deep663" target="_blank" rel="noopener noreferrer" aria-label="Github">
          <i className="bi bi-github"></i>
        </a>
        <a
          href="https://linkedin.com/in/deepsenchowa"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="mailto:deepsenchowa1@gmail.com" aria-label="Email">
          <i className="bi bi-envelope-fill"></i>
        </a>
      </div>
    </footer>
  );
}
