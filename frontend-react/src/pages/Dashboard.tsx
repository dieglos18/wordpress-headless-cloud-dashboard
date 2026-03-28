import { isAxiosError } from "axios";
import { ProjectCard } from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";

export function Dashboard() {
  const { data, isPending, isError, error, refetch } = useProjects();

  if (isPending) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3 text-app-muted">
          <span
            className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-secondary dark:border-white/12 dark:border-t-secondary"
            aria-hidden
          />
          <p className="text-ink">Loading projects…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const message = isAxiosError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

    return (
      <div className="px-4 py-10 sm:px-6">
        <div
          className="max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-left text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300/95"
          role="alert"
        >
          <p className="font-medium">Could not load projects</p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const projects = data ?? [];

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 max-w-2xl text-left">
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-app-muted">
          WordPress projects and Elementor previews
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-left text-app-muted">No projects found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:gap-6">
          {projects.map((project) => (
            <li key={project.id} className="min-w-0">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
