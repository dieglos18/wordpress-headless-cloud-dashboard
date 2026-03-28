import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
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
    <div className="border-b border-zinc-100 py-4 last:border-0 dark:border-zinc-800">
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}

function renderProjectFields(project: Project) {
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
          <p className="whitespace-pre-line text-zinc-800 dark:text-zinc-200">
            {project.project_description}
          </p>
        ) : (
          "—"
        )}
      </Field>
      <Field label="Project URL">
        {project.project_url ? (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 underline hover:text-violet-700 dark:text-violet-400"
          >
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
            className="break-all text-violet-600 underline hover:text-violet-700 dark:text-violet-400"
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

  if (idParam === undefined || projectId === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-left">
        <p className="text-zinc-600 dark:text-zinc-400">Invalid project id.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
          <span
            className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-violet-600 dark:border-zinc-600 dark:border-t-violet-400"
            aria-hidden
          />
          <p>Loading project…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const notFound =
      isAxiosError(error) && error.response?.status === 404;
    const message = isAxiosError(error)
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-left">
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
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
        <Link
          to="/"
          className="mt-6 inline-block text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-left">
        <p className="text-zinc-600 dark:text-zinc-400">Project not found.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-left">
      <Link
        to="/"
        className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
      >
        ← Back to dashboard
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {data.project_name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">ID {data.id}</p>
        </div>
        {data.preview_page_url ? (
          <a
            href={data.preview_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
          >
            Preview
          </a>
        ) : (
          <span className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            No preview URL
          </span>
        )}
      </header>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        {renderProjectFields(data)}
      </section>
    </div>
  );
}
