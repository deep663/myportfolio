import type { Project } from "@/lib/types";

/** Deterministic per-card hover accent, rotating by display `order` (see
 * `app/globals.css`'s `[data-accent]` rules) — not tied to any specific
 * project's identity, so it stays correct as projects are added/removed. */
const ACCENTS = ["amber", "green", "cyan"] as const;

/**
 * Renders one `Project` (title, tags, description, GitHub link). Pure
 * presentational Server Component — owns no ordering/filtering logic
 * (that belongs to `Projects.tsx`). Markup/CSS classes port
 * `.project-card*` from `legacy-website/css/index.css` (ported selectively
 * per `03-legacy-migration-mapping.md` §4).
 *
 * @param project - one project entry matching `lib/types.ts`'s `Project` shape
 */
export default function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENTS[(project.order - 1) % ACCENTS.length];
  return (
    <div className="project-card" data-accent={accent}>
      <div className="project-card-header">
        <span className="proj-index">{project.category}</span>
        <i className={`bi ${project.icon} proj-icon`}></i>
        <h3 className="proj-title">{project.title}</h3>
        <span className="proj-type-badge">{project.type}</span>
      </div>
      <div className="project-card-body">
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
        <p>{project.description}</p>
      </div>
      <div className="project-card-footer">
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="arrow-box" aria-label="GitHub">
          <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>
    </div>
  );
}
