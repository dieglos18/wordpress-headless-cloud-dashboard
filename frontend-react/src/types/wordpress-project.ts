/** ACF payload as returned by WordPress REST for CPT `projects`. */
export interface WpProjectAcf {
  project_name?: string;
  client_name?: string;
  status?: "draft" | "in_progress" | "production" | string;
  architecture_type?: string;
  tech_stack?: string;
  project_description?: string;
  project_url?: string;
  featured_image?: number;
  preview_page_url?: string;
}

/** Minimal WordPress REST shape for `wp/v2/projects` items. */
export interface WpProjectRest {
  id: number;
  slug?: string;
  title?: { rendered: string };
  acf?: WpProjectAcf | null;
}
