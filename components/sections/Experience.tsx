import type { Experience as ExperienceEntry } from "@/lib/types";
import ExperienceCard from "./ExperienceCard";
import Reveal from "../ui/Reveal";

/**
 * Same list-rendering pattern as `Projects.tsx`, over `Experience[]`
 * (`lib/content.ts`'s `getExperience()`). Order is preserved as given —
 * ports `legacy-website/index.html`'s Work Experience section verbatim.
 *
 * @param entries - experience entries in display order
 */
export default function Experience({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <section id="experience" className="mt-10 flex w-full flex-col items-center lg:p-6">
      <div className="flex w-full flex-col gap-8 rounded-xl bg-gray-100 p-4 lg:flex-row lg:justify-around">
        <Reveal>
          <h3 className="text-center text-6xl font-medium max-lg:text-3xl lg:sticky lg:top-[20%]">
            Work Experience
          </h3>
        </Reveal>
        <div className="flex w-full flex-col items-center gap-4 p-2 lg:w-1/2">
          {entries.map((entry) => (
            <Reveal key={`${entry.org}-${entry.start}`}>
              <ExperienceCard entry={entry} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
