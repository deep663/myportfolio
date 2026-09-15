import type { SkillCategory as SkillCategoryType, SkillCategoryName } from "@/lib/types";

/**
 * Each category's icon rests ink-black and picks up a signature accent on
 * hover — the "color on contact" rule shared with `TechIcon`/`ProjectCard`.
 * Colors rotate rather than repeat consecutively, so adjacent cards in the
 * wrapped grid don't read as duplicates of each other.
 */
const ACCENT_CLASS: Record<SkillCategoryName, string> = {
  Frontend: "group-hover:text-[var(--accent-cyan)]",
  Backend: "group-hover:text-[var(--accent-green)]",
  Databases: "group-hover:text-[var(--accent-amber)]",
  Languages: "group-hover:text-[var(--accent-cyan)]",
  Tools: "group-hover:text-[var(--accent-green)]",
  Concepts: "group-hover:text-[var(--accent-amber)]",
};

/**
 * Renders one skill category card: icon, name heading, comma-joined
 * skill list. Ports `legacy-website/index.html`'s Technical Skills
 * category-card markup verbatim.
 *
 * @param category - one skill category matching `lib/types.ts`'s `SkillCategory` shape
 */
export default function SkillCategory({ category }: { category: SkillCategoryType }) {
  return (
    <div className="group flex flex-col gap-2 p-4">
      <div className="flex gap-1">
        <i
          className={`bi ${category.icon} text-2xl text-neutral-800 transition-colors duration-300 ${ACCENT_CLASS[category.name]}`}
        ></i>
        <h3 className="text-2xl font-semibold">{category.name}</h3>
      </div>
      <div className="text-[#595959]">{category.skills.join(", ")}</div>
    </div>
  );
}
