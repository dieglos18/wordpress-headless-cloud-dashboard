# WordPress backend: export layout and import guide

This folder holds **database**, **ACF field group export**, and **media uploads** so someone can recreate the WordPress side locally (e.g. with [Local](https://localwp.com/)).

## Folder layout

```text
wordpress-export/
├── README.md                          # This file
├── database/
│   └── cloud-dashboard-backup.sql     # Full database dump
├── acf-fields/
│   └── acf-export-project-details.json  # ACF field groups (JSON)
├── uploads/
│   └── uploads-backup.zip             # wp-content/uploads archive (optional but recommended)
└── screenshots/
    └── README.md                      # Placeholder for WP admin / API reference captures
```

## Exporting again (from your machine)

### 1. Database

**Option A – Local (recommended)**

1. Right-click the site in Local → **Open site shell**.
2. Run:

```bash
wp db export cloud-dashboard-backup.sql
```

3. Find the file via **Reveal in Finder** / **Show folder** (site root), then copy it into `wordpress-export/database/` (replace the existing SQL if you are updating the repo).

**Option B – UpdraftPlus**

1. WordPress admin → **UpdraftPlus** → Backup / Restore.
2. Run a backup with **Database** only, then download the database archive and extract the `.sql` if needed before placing it in `wordpress-export/database/`.

### 2. ACF field groups

1. **ACF** → **Tools** → **Export Field Groups**.
2. Select the group(s) used for projects (e.g. **Project Details**).
3. **Export as JSON** and save as `acf-export-project-details.json` under `wordpress-export/acf-fields/`.

### 3. Uploads (featured images and media)

1. Open the site folder in Local → `app/public/wp-content/uploads/`.
2. Zip the folders you need (full `uploads` or year folders such as `2026/`).
3. Save as `wordpress-export/uploads/uploads-backup.zip`.

---

## Import: step by step

### 1. Create a site in Local

- Name: e.g. `cloud-dashboard`
- PHP 8.0+ (or match your export)
- Web server: Nginx or Apache (either is fine)
- MySQL 8.0+

Complete the WordPress installer if you start from an empty site, **or** import the database below first (empty admin flow may differ).

### 2. Import the database

**From Local site shell:**

```bash
wp db import /full/path/to/wordpress-export/database/cloud-dashboard-backup.sql
```

**Or with Adminer (Local → Database → Adminer):** Import → choose `cloud-dashboard-backup.sql` → Execute.

**URLs after import:** If the old site used another domain (e.g. `cloud-dashboard.local`), run a search-replace for URLs in the database or use:

```bash
wp search-replace 'https://old-host.test' 'https://cloud-dashboard.local' --all-tables
```

(Adjust hosts to match your Local domain.)

### 3. Install and activate plugins

In **Plugins → Add New**, install (names may vary slightly):

| Plugin | Role |
|--------|------|
| **Advanced Custom Fields (ACF)** | Custom fields on projects |
| **Custom Post Type UI** | If your CPT was registered with CPT UI |
| **Elementor** | Preview / layout pages (if used) |
| **Contact Form 7** | Optional: contact forms |
| **Yoast SEO** | Optional |

Activate all that your site expects. If the SQL already references plugins, missing plugins can cause errors until they are installed.

### 4. Import ACF JSON

1. **ACF** → **Tools** → **Import**.
2. Choose `acf-fields/acf-export-project-details.json`.
3. **Import**.

Ensure the field group is attached to the **projects** post type and **Show in REST API** is enabled (ACF field group settings).

### 5. Restore uploads

Unzip into `wp-content`:

```bash
cd /path/to/site/app/public/wp-content
unzip /full/path/to/wordpress-export/uploads/uploads-backup.zip
```

If the zip contains an `uploads` root folder, merge so files end up under `wp-content/uploads/`.

### 6. Verify

**Projects**

- Admin sidebar: **Projects** (or your CPT label).
- You should see project entries matching the imported database.

**REST API**

Open in the browser (adjust host):

```text
https://YOUR-LOCAL-SITE.local/wp-json/wp/v2/projects
```

Expect JSON with project posts and `acf` fields when exposed.

**Elementor (if used)**

- **Elementor → Theme Builder** (or **Templates**) and confirm header/footer/single templates if they were part of the export.

### 7. Connect the React app

In `frontend-react/`:

```bash
cp .env.example .env
```

Set:

```env
VITE_API_BASE_URL=http://YOUR-LOCAL-SITE.local/wp-json/wp/v2
```

Use `http` vs `https` to match Local and avoid self-signed certificate issues in the browser.

See also [docs/WORDPRESS.md](../docs/WORDPRESS.md) for CORS, media endpoint, and preview URLs.

---

## Access and credentials

After import, admin users come from the **database**. If you need a new administrator:

```bash
wp user create admin2 admin2@example.com --role=administrator --user_pass='choose-a-strong-password'
```

Use **Application Passwords** or cookie auth only in the WordPress admin; the React dashboard in this repo uses **public REST** reads by default (adjust if you lock the API).

---

## API endpoints (reference)

| Use | Method | Path (relative to `.../wp-json/wp/v2`) |
|-----|--------|----------------------------------------|
| List projects | GET | `/projects` |
| Single project | GET | `/projects/{id}` |
| Media (featured image URL) | GET | `/media/{id}` |

Base URL in env: `VITE_API_BASE_URL` = `https://host/wp-json/wp/v2` (no trailing slash issues—client uses axios `baseURL`).

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| ACF fields missing in JSON API | ACF → Field groups → edit group → Settings → **Show in REST API**: On. |
| CPT not in REST | CPT UI → Edit post type `projects` → **Show in REST API**: true. |
| Pretty permalinks / 404 on REST | **Settings → Permalinks** → choose **Post name** → Save. |
| CORS errors from Vite (`localhost:5173`) | Allow origin in WordPress or use a Vite dev proxy; see [docs/WORDPRESS.md](../docs/WORDPRESS.md). |
| Wrong site URL / mixed content | `wp option get siteurl` / `home`, or `wp search-replace` for old domain. |
| Elementor styles broken | **Elementor → Tools → Regenerate CSS & Data**. |
| Certificate errors to Local HTTPS | Point `VITE_API_BASE_URL` to `http://...` for local dev. |

---

## Plugin versions (indicative)

Exact versions depend on your export date. Typical stack:

| Plugin | Notes |
|--------|--------|
| ACF | 6.x – field groups and REST |
| CPT UI | 1.x – CPT registration (if used) |
| Elementor | 3.x – templates and previews |
| Contact Form 7 | 5.x – optional |
| Yoast SEO | Optional |

---

## Reference screenshots (optional)

Add admin/API captures under `wordpress-export/screenshots/` (see [screenshots/README.md](screenshots/README.md)) for recruiters: projects list, ACF group, Theme Builder, sample REST response.

---

## Updating this export later

```bash
wp db export cloud-dashboard-backup.sql
# Replace wordpress-export/database/cloud-dashboard-backup.sql
# Re-export ACF JSON and uploads zip as needed
```
