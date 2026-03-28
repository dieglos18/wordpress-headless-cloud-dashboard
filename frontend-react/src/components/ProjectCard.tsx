import { Link } from "react-router-dom";
import { ProjectFeaturedImage } from "./ProjectFeaturedImage";
import type { Project } from "../types/project";

function statusBadgeClass(status: Project["status"]) {
  const base =
    "inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (status) {
    case "Production":
      return `${base} bg-emerald-100 text-emerald-900 dark:bg-emerald-900/35 dark:text-emerald-300/95`;
    case "In Progress":
      return `${base} bg-amber-100 text-amber-900 dark:bg-amber-900/35 dark:text-amber-200/95`;
    default:
      return `${base} bg-slate-200 text-slate-800 dark:bg-white/8 dark:text-slate-300`;
  }
}

/** Matches ProjectFeaturedImage cardSide shell when there is no media id. */
function CardImagePlaceholder() {
  return (
    <div
      className="relative flex h-40 w-full min-h-0 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-slate-100 text-xs font-medium text-app-muted dark:bg-black/25 dark:text-app-muted sm:h-full sm:min-h-36 sm:w-32 sm:self-stretch md:w-36 xl:w-40 sm:rounded-l-xl sm:rounded-t-none sm:rounded-br-none"
      aria-hidden
    >
      No photo
    </div>
  );
}

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const hasPreview = Boolean(project.preview_page_url);
  const hasMediaId = Boolean(project.featured_image?.trim());

  return (
    <article className="group flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-app-card shadow-sm transition-all duration-200 hover:border-secondary/35 hover:shadow-md focus-within:ring-2 focus-within:ring-secondary/30 sm:flex-row sm:items-stretch dark:border-white/8 dark:bg-app-card dark:hover:border-secondary/40">
      {hasMediaId ? (
        <ProjectFeaturedImage
          mediaId={project.featured_image}
          alt={`Featured image for ${project.project_name}`}
          variant="cardSide"
        />
      ) : (
        <CardImagePlaceholder />
      )}

      <div className="flex min-w-0 flex-1 flex-col border-slate-100 p-4 sm:border-l sm:p-5 dark:border-white/6">
        <h2 className="min-w-0 text-base font-semibold leading-snug text-ink xl:text-[0.9375rem]">
          <Link
            to={`/projects/${project.id}`}
            className="line-clamp-2 rounded-sm text-primary transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-white dark:hover:text-secondary"
          >
            {project.project_name}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-app-muted sm:line-clamp-3 sm:text-sm">
          {project.architecture_type || "Architecture type not set"}
        </p>

        <div className="mt-auto w-full min-w-0 border-t border-slate-100 pt-4 dark:border-white/8 sm:pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-wrap gap-2">
              <Link
                to={`/projects/${project.id}`}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-xs font-medium text-ink transition-colors hover:border-primary/40 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-none sm:px-3 sm:text-sm dark:border-white/10 dark:bg-white/4 dark:text-ink dark:hover:bg-white/7"
              >
                View
              </Link>
              {hasPreview ? (
                <a
                  href={project.preview_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-secondary px-2 py-1.5 text-center text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:flex-none sm:px-3 sm:text-sm"
                >
                  Preview
                </a>
              ) : (
                <span className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-2 py-1.5 text-center text-xs font-medium text-app-muted dark:bg-white/5 dark:text-app-muted sm:flex-none sm:px-3 sm:text-sm">
                  No preview
                </span>
              )}
            </div>
            <span
              className={`shrink-0 self-end sm:self-center ${statusBadgeClass(project.status)}`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
