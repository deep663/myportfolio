import type { Certification } from "@/lib/types";
import CertificationCard from "./CertificationCard";
import Reveal from "../ui/Reveal";

/**
 * Same list-rendering pattern as `Projects.tsx`/`Experience.tsx`, over
 * `Certification[]` (`lib/content.ts`'s `getCertifications()`).
 *
 * @param entries - certification entries in display order
 */
export default function Certifications({ entries }: { entries: Certification[] }) {
  return (
    <section id="certifications" className="flex w-full flex-col items-center p-[2%] max-lg:p-3">
      <Reveal>
        <h2 className="mt-5 text-4xl font-semibold">Certifications &amp; Education</h2>
      </Reveal>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-10">
        {entries.map((entry) => (
          <Reveal key={entry.title}>
            <CertificationCard certification={entry} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
