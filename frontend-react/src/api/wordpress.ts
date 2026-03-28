import axios from "axios";
import { API_BASE_URL } from "./config";
import type { Project, ProjectWorkflowStatus } from "../types/project";
import type { WpProjectRest } from "../types/wordpress-project";

export const wordpressApi = axios.create({
  baseURL: API_BASE_URL,
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function mapAcfStatus(value?: string): ProjectWorkflowStatus {
  switch (value) {
    case "draft":
      return "Draft";
    case "in_progress":
      return "In Progress";
    case "production":
      return "Production";
    default:
      return "Draft";
  }
}

export function mapWpProjectToProject(raw: WpProjectRest): Project {
  const acf = raw.acf ?? {};
  const titleRendered = raw.title?.rendered
    ? stripHtml(raw.title.rendered)
    : "";

  const featured =
    typeof acf.featured_image === "number" && acf.featured_image > 0
      ? String(acf.featured_image)
      : "";

  const projectName =
    (acf.project_name?.trim() || titleRendered || `Project #${raw.id}`).trim();

  return {
    id: raw.id,
    slug: raw.slug ?? "",
    project_name: projectName,
    client_name: acf.client_name ?? "",
    status: mapAcfStatus(acf.status),
    architecture_type: acf.architecture_type ?? "",
    tech_stack: acf.tech_stack ?? "",
    project_description: acf.project_description ?? "",
    project_url: acf.project_url ?? "",
    featured_image: featured,
    preview_page_url: acf.preview_page_url ?? "",
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await wordpressApi.get<WpProjectRest[]>("/projects");
  return response.data.map(mapWpProjectToProject);
}

export async function fetchProject(id: number | string): Promise<Project> {
  const response = await wordpressApi.get<WpProjectRest>(`/projects/${id}`);
  return mapWpProjectToProject(response.data);
}
