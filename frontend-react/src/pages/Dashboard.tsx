import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";

function previewButtonClass(disabled: boolean) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors";
  if (disabled) {
    return `${base} cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500`;
  }
  return `${base} bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600`;
}

export function Dashboard() {
  const { data, isPending, isError, error, refetch } = useProjects();

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <span
            className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-violet-600 dark:border-zinc-600 dark:border-t-violet-400"
            aria-hidden
          />
          <p>Loading projects…</p>
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
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-left text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          WordPress projects and Elementor previews
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-left text-zinc-600 dark:text-zinc-400">No projects found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Project name
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Architecture
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {project.project_name}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                    {project.architecture_type || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        View
                      </Link>
                      {project.preview_page_url ? (
                        <a
                          href={project.preview_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={previewButtonClass(false)}
                        >
                          Preview
                        </a>
                      ) : (
                        <span className={previewButtonClass(true)}>No preview</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
