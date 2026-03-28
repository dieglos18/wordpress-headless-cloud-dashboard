import { isAxiosError } from "axios";
import { ProjectList } from "../components/ProjectList";
import { useProjects } from "../hooks/useProjects";

export function Home() {
  const { data, isPending, isError, error, refetch } = useProjects();

  if (isPending) {
    return (
      <main className="projects-page">
        <p className="projects-state">Loading projects…</p>
      </main>
    );
  }

  if (isError) {
    const message = isAxiosError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

    return (
      <main className="projects-page">
        <div className="projects-state projects-error" role="alert">
          <p>Could not load projects: {message}</p>
          <button type="button" className="projects-retry" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="projects-page">
      <h1 className="projects-page__title">Projects</h1>
      <ProjectList projects={data ?? []} />
    </main>
  );
}
