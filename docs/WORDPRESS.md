# WordPress, REST API, and Elementor integration

This document describes how the React dashboard talks to WordPress and how preview links relate to Elementor (or any front-end page).

## Data flow

1. WordPress exposes a custom post type (e.g. **projects**) on the REST API under `GET /wp/v2/projects` (and `GET /wp/v2/projects/{id}`).
2. Each project includes **ACF** (or equivalent) fields mapped in the client (see `frontend-react/src/api/wordpress.ts`).
3. The dashboard lists projects and opens **Preview** using `preview_page_url` from ACF (full URL or path normalized against `VITE_API_BASE_URL`).
4. **Featured images** are stored in ACF as a **media attachment ID**. The app resolves the file URL with `GET /wp/v2/media/{id}` and caches it with TanStack Query.

For visual consistency between the dashboard and live pages, keep typography, colors, and copy in WordPress / ACF / Elementor. The React UI is a shell around the same data; it does not render Elementor layouts.

## Preview URLs (`preview_page_url`)

- Values come from ACF as returned by the REST API.
- The client trims strings and normalizes relative paths against the same origin as `VITE_API_BASE_URL` (see `frontend-react/src/lib/url.ts`).
- Use absolute URLs in ACF if the preview lives on another host; use paths relative to the WordPress site if they share a base URL.

## Featured images and `GET /wp/v2/media/{id}`

- The attachment must exist in the **Media Library** and be an image.
- The REST API must allow the consumer your dashboard uses (anonymous read, application passwords, or JWT—depending on your setup).
- **`img` vs XHR:** `<img src="...">` can behave differently from JavaScript requests regarding CORS. This app fetches media metadata via the REST API first, so **CORS must allow that request** from the dashboard origin unless you proxy the API through the same host as the Vite app.

## CORS and local development

If the React app runs on a different origin than WordPress (for example `http://localhost:5173` and `http://cloud-dashboard.local`), the browser enforces CORS on axios/fetch to `wp-json`.

Mitigations:

- Configure WordPress or a plugin to send `Access-Control-Allow-Origin` for your dev origin, or
- Use a **Vite dev proxy** so `/wp-json` is requested same-origin during development.

Self-signed HTTPS on the WordPress host can also block requests from the browser; using HTTP locally or fixing TLS is often simpler for dev.

## WordPress checklist

- CPT **projects** (or your slug) is **show_in_rest: true**.
- ACF field group is attached to that CPT and exposed to REST (ACF setting or filter as needed).
- `preview_page_url` points to the intended Elementor (or theme) page.
- Featured image field stores a valid media ID.
- Media and project endpoints are reachable with the same base URL you set in `VITE_API_BASE_URL` (typically `https://your-site/wp-json/wp/v2`).
