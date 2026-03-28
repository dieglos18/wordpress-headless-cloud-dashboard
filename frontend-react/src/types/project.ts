export type ProjectWorkflowStatus = "Draft" | "In Progress" | "Production";

/** Normalized project for the React app (mapped from WP REST + ACF). */
export interface Project {
  id: number;
  slug: string;
  project_name: string;
  client_name: string;
  status: ProjectWorkflowStatus;
  architecture_type: string;
  tech_stack: string;
  project_description: string;
  project_url: string;
  featured_image: string;
  preview_page_url: string;
}
