export interface Project {
  id: number;
  project_name: string;
  client_name: string;
  status: "Draft" | "In Progress" | "Production";
  architecture_type: string;
  tech_stack: string;
  project_description: string;
  project_url: string;
  featured_image: string;
}
