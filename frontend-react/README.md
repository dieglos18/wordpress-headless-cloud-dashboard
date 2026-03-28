# Cloud dashboard (React)

Headless dashboard that lists WordPress **projects** from the REST API, shows featured images, and links to Elementor (or site) preview URLs.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | TypeScript check + production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Environment

Copy [.env.example](.env.example) to `.env` and set:

- **`VITE_API_BASE_URL`** — WordPress REST base, including `wp/v2` (example: `http://your-site.local/wp-json/wp/v2`).

Vite embeds only variables prefixed with `VITE_`.

## Project layout

| Path | Role |
|------|------|
| `src/api/` | Axios client, WordPress endpoints, env config |
| `src/pages/` | `Dashboard`, `ProjectDetail` |
| `src/components/` | Shell, cards, featured image, theme toggle |
| `src/hooks/` | React Query hooks, theme |
| `src/types/` | TypeScript models for API payloads |

Routing lives in `src/App.tsx` (`/` and `/projects/:id`).

## WordPress and CORS

Integration details, media IDs, preview URLs, and CORS notes: **[../docs/WORDPRESS.md](../docs/WORDPRESS.md)**.

For generic Vite + React tooling (ESLint extensions, React Compiler, etc.), see the [Vite documentation](https://vite.dev/guide/).
