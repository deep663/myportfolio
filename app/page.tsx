import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import {
  getPositioning,
  getProjects,
  getExperience,
  getSkillCategories,
  getCertifications,
} from "@/lib/content";

/**
 * Home route ("/") — composes every section in the order STORY-1.2
 * requires: Hero → About(new) → Projects → Experience → Skills →
 * Certifications (Footer renders in `app/layout.tsx`). Static Site
 * Generation (ADR-002): every section is a pure Server Component render
 * of build-time content, no client-side fetching.
 */
export default function Home() {
  const positioning = getPositioning();
  const projects = getProjects();
  const experience = getExperience();
  const skillCategories = getSkillCategories();
  const certifications = getCertifications();

  return (
    <main className="flex flex-1 flex-col">
      <Hero positioning={positioning} />
      <About narrative={positioning.aboutNarrative} />
      <Projects projects={projects} />
      <Experience entries={experience} />
      <Skills categories={skillCategories} />
      <Certifications entries={certifications} />
    </main>
  );
}
