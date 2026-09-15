import type { SkillCategory as SkillCategoryType } from "@/lib/types";
import SkillCategory from "./SkillCategory";
import CTALink from "../ui/CTALink";
import Reveal from "../ui/Reveal";

/**
 * Renders every `SkillCategory` (STORY-2.3: no existing accurate entry is
 * silently dropped — every category/entry in the `content/skills.json`
 * fixture renders). Single-column at phone width (AC3), a proper grid from
 * `sm` up.
 *
 * A CSS grid, not a wrapped flex row, on purpose: category entry counts
 * range from 3 (Concepts) to 11 (Backend) skills, so card heights vary a
 * lot. `flex-wrap` stretches every card in a row to match its tallest
 * neighbor and packs an inconsistent number of cards per row depending on
 * width, which is what made the section look unaligned. A grid gives every
 * card a fixed column track and `items-start` keeps each card at its own
 * natural height instead of stretching — same content, cards actually line
 * up.
 *
 * @param categories - skill categories from `lib/content.ts`'s `getSkillCategories()`
 */
export default function Skills({ categories }: { categories: SkillCategoryType[] }) {
  return (
    <section id="skills" className="flex w-full flex-col items-center p-6">
      <Reveal>
        <h2 className="mt-5 text-4xl font-semibold">Technical Skills</h2>
      </Reveal>
      <div className="mt-6 grid w-full max-w-4xl grid-cols-1 items-start gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Reveal key={category.name}>
            <SkillCategory category={category} />
          </Reveal>
        ))}
      </div>
      <CTALink href="mailto:deepsenchowa1@gmail.com" label="Get in touch" icon="bi-arrow-up-right" />
    </section>
  );
}
