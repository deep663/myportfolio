import type { Certification } from "@/lib/types";

/**
 * Renders one `Certification` entry — accent header, title, description.
 * Ports `.exp-card` markup from `legacy-website/index.html`'s
 * Certifications & Education section verbatim (`03-legacy-migration-mapping.md`
 * §5: ports as-is, no content changes needed).
 *
 * @param certification - one certification entry matching `lib/types.ts`'s `Certification` shape
 */
export default function CertificationCard({ certification }: { certification: Certification }) {
  return (
    <div className="exp-card">
      <div className="exp-card-header" style={{ backgroundColor: certification.headerBg }}>
        <i className={`bi ${certification.icon} text-5xl text-white`}></i>
        <p className="mt-2 font-semibold text-white">{certification.issuer}</p>
      </div>
      <h3 className="exp-card-title">{certification.title}</h3>
      <p className="exp-card-desc">{certification.description}</p>
    </div>
  );
}
