/**
 * Normalizes CMS URLs for safe use in href. Absolute http(s) URLs are
 * validated; relative paths are resolved against the WordPress REST origin
 * (same host as VITE_API_BASE_URL). Invalid values return an empty string.
 */
export function normalizePageUrl(
  raw: string | undefined | null,
  apiBaseUrl: string,
): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) return "";

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const u = new URL(trimmed);
      return u.href;
    }

    const base = new URL(apiBaseUrl);
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return new URL(path, `${base.origin}/`).href;
  } catch {
    return "";
  }
}
