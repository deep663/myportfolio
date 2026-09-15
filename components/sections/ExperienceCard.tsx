import type { Experience } from "@/lib/types";

/**
 * Renders one `Experience` entry — role, org, badge, date range,
 * description. Ports `.tw-border-2 tw-border-black` card markup from
 * `legacy-website/index.html`'s Work Experience section verbatim
 * (`03-legacy-migration-mapping.md` §5: content ports as-is, including
 * confirmed-intentional overlapping dates — no overlap validation here).
 *
 * @param entry - one experience entry matching `lib/types.ts`'s `Experience` shape
 */
export default function ExperienceCard({ entry }: { entry: Experience }) {
  return (
    <div className="group flex w-full flex-col gap-4 border-2 border-black bg-white p-4">
      <div className="flex w-full items-center gap-4 p-2">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-black transition-colors duration-300 group-hover:bg-[var(--accent-amber)]">
          {entry.badge}
        </div>
        <div>
          <p className="text-xl font-semibold">{entry.role}</p>
          <p className="text-lg text-gray-600">{entry.org}</p>
          <p className="text-sm text-gray-400">
            {entry.start} – {entry.end}
          </p>
        </div>
      </div>
      <div className="text-justify text-gray-800">{entry.description}</div>
    </div>
  );
}
