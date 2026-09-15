import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Reveal from "../ui/Reveal";

/**
 * Maps `Project[]` (from `lib/content.ts`'s `getProjects()`) to
 * `ProjectCard[]`, preserving array order — EVA is first per its `order`
 * field (STORY-3.1), only EVA + VideoTube remain post STORY-3.3. Ordering
 * is a content-loader concern (`lib/content.ts` sorts by `order`); this
 * component simply renders the array it is given, in order.
 *
 * @param projects - project entries, already sorted by display order
 */
export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="flex w-full flex-col items-center p-6">
      <h2 className="text-6xl font-medium max-lg:text-3xl">Projects</h2>
      <div className="my-4 h-px w-4/5 bg-black"></div>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {projects.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
