import type { Project } from "../types/project";

type ProjectListProps = {
  projects: Project[];
};

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <p className="projects-empty">No projects found.</p>;
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-list__item">
          <strong>{project.project_name}</strong>
          {project.client_name ? (
            <span className="project-list__client"> — {project.client_name}</span>
          ) : null}
          <span className="project-list__status"> ({project.status})</span>
        </li>
      ))}
    </ul>
  );
}
