import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import { ProjectFeaturedImage } from "../components/ProjectFeaturedImage";
import { useProject } from "../hooks/useProject";
import type { Project } from "../types/project";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0 dark:border-white/6">
      <dt className="text-xs font-semibold uppercase tracking-wide text-app-muted">
        {label}
      </dt>
      <dd className="mt-1 text-ink">{children}</dd>
    </div>
  );
}

function renderProjectFields(project: Project) {
  const linkClass =
    "break-all text-secondary underline decoration-secondary/40 underline-offset-2 transition-colors hover:text-primary dark:text-sky-400/95 dark:hover:text-secondary";

  return (
    <dl>
      <Field label="Project name">{project.project_name}</Field>
      <Field label="Slug">{project.slug || "—"}</Field>
      <Field label="Client">{project.client_name || "—"}</Field>
      <Field label="Status">{project.status}</Field>
      <Field label="Architecture type">{project.architecture_type || "—"}</Field>
      <Field label="Tech stack">
        {project.tech_stack ? (
          <span className="whitespace-pre-wrap">{project.tech_stack}</span>
        ) : (
          "—"
        )}
      </Field>
      <Field label="Description">
        {project.project_description ? (
          <p className="whitespace-pre-line text-ink/95">
            {project.project_description}
          </p>
        ) : (
          "—"
        )}
      </Field>
      <Field label="Project URL">
        {project.project_url ? (
          <a href={project.project_url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {project.project_url}
          </a>
        ) : (
          "—"
        )}
      </Field>
      <Field label="Featured image (media ID)">{project.featured_image || "—"}</Field>
      <Field label="Preview page URL">
        {project.preview_page_url ? (
          <a
            href={project.preview_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {project.preview_page_url}
          </a>
        ) : (
          "—"
        )}
      </Field>
    </dl>
  );
}

export function ProjectDetail() {
  const { id: idParam } = useParams<{ id: string }>();
  const numericId = idParam !== undefined ? Number(idParam) : NaN;
  const projectId = Number.isFinite(numericId) ? numericId : undefined;

  const { data, isPending, isError, error, refetch } = useProject(projectId);

  const backLinkClass =
    "text-sm font-medium text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary dark:text-sky-400/95 dark:hover:text-secondary";

  if (idParam === undefined || projectId === undefined) {
    return (
      <div className="px-4 py-10 text-left sm:px-6">
        <p className="text-app-muted">Invalid project id.</p>
        <Link to="/" className={`mt-4 inline-block ${backLinkClass}`}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3 text-app-muted">
          <span
            className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-secondary dark:border-white/12 dark:border-t-secondary"
            aria-hidden
          />
          <p className="text-ink">Loading project…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    const message = isAxiosError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

    return (
      <div className="px-4 py-10 text-left sm:px-6">
        <div
          className="max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300/95"
          role="alert"
        >
          <p className="font-medium">
            {notFound ? "Project not found" : "Could not load project"}
          </p>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
        <Link to="/" className={`mt-6 inline-block ${backLinkClass}`}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 py-10 text-left sm:px-6">
        <p className="text-app-muted">Project not found.</p>
        <Link to="/" className={`mt-4 inline-block ${backLinkClass}`}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const hasPreview = Boolean(data.preview_page_url);

  return (
    <div className="px-4 py-8 text-left sm:px-6 sm:py-10">
      <Link to="/" className={`inline-block ${backLinkClass}`}>
        ← Back to dashboard
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
            {data.project_name}
          </h1>
          <p className="mt-1 text-sm text-app-muted">ID {data.id}</p>
        </div>
        {hasPreview ? (
          <a
            href={data.preview_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Preview
          </a>
        ) : (
          <span className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-app-muted dark:bg-white/5">
            No preview URL
          </span>
        )}
      </header>

      {data.featured_image ? (
        <div className="mt-8">
          <ProjectFeaturedImage
            mediaId={data.featured_image}
            alt={`Featured image for ${data.project_name}`}
            variant="detail"
          />
        </div>
      ) : null}

      <section className="mt-8 rounded-xl border border-slate-200 bg-app-card p-6 shadow-sm dark:border-white/8">
        {renderProjectFields(data)}
      </section>
    </div>
  );
}
