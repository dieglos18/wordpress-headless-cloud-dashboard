const DEFAULT_API_BASE_URL =
  "https://cloud-dashboard.local/wp-json/wp/v2";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
