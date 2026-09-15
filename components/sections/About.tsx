import Reveal from "../ui/Reveal";

/**
 * About section — net-new narrative content (STORY-2.2; the legacy site
 * has no distinct About block). Renders `aboutNarrative` as prose
 * paragraphs, deliberately not a bullet list, per AC Scenario 1. Placed
 * directly after Hero (`06-risks-and-open-questions.md` A1). The narrative
 * text itself is authored content — see `content/site-copy.json` and PR
 * notes for the STORY-2.2 draft-copy flag pending Deep Senchowa's sign-off.
 *
 * @param narrative - ordered paragraphs of About prose
 */
export default function About({ narrative }: { narrative: string[] }) {
  return (
    <section id="about" className="flex w-full flex-col items-center p-6 max-lg:p-4">
      <Reveal>
        <h2 className="text-4xl font-semibold">About</h2>
      </Reveal>
      <div className="mt-6 flex max-w-3xl flex-col gap-4 text-justify leading-relaxed text-gray-800">
        {narrative.map((paragraph, i) => (
          <Reveal key={i}>
            <p>{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
