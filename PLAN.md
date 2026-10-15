# BENALLOWAY.COM

## Summary

Build `benalloway.com` (`benalloway/benalloway-dot-com`) — a fast, mobile-first
personal wiki, movie collection catalog, and article/blog site built on the
exact same framework and agent factory as `benalloway/recipes`.

Key decisions:

- **Platform:** Cloudflare Workers (free tier) serving `benalloway.com`
- **Frontend:** Astro 7 (SSR via Cloudflare adapter) + plain TS islands (zero
  client framework JS for instant mobile rendering)
- **Design System (`@benalloway/ui`):** Shared Astro design kit (`../ui`,
  vendored via `scripts/sync-ui.sh` into `src/components/ui/` and
  `src/styles/global.css`) combining **Oatmeal (olive-instrument)** tokens +
  **Catalyst UI Kit** + **Tailwind UI Ecommerce** building blocks, reinforced
  with **Material Design 3 (MD3)** mobile ergonomics (48px minimum touch
  targets, semantic tonal surfaces, clear state layers, light/dark theme toggle)
- **Wiki & Articles:** Astro Content Collections (`src/content/articles/*.md`)
  so adding new wiki pages, top-N movie lists, or life update blog posts is
  dropping a single Markdown file
- **Movie Database:** Validated via Zod (`src/data/movies.ts`) using Plex Media
  Server's `Metadata` schema (`title`, `sortTitle`, `originalTitle`, `year`,
  `contentRating`, `duration`, `studio`, `editionTitle`, `userRating`, `guids`
  for `imdb://` and `tmdb://`) plus physical format (`4K UHD`, `Blu-ray`, `DVD`,
  `Digital`) and A/V transfer specs. Exported at `/api/movies.json` in Plex
  `MediaContainer.Metadata` shape for seamless future Plex/D1 portability
- **Repo & Agent Process:** 1:1 with `benalloway/recipes` (`AGENTS.md`,
  `CONTRIBUTING.md`, `GLOSSARY.md`, `docs/adr/`, Forge factory, Pocock skills),
  supporting both Docker-free local runs (`npm run forge` via git
  worktrees) and cloud GitHub Actions runs (`npm run forge:gh` /
  `.github/workflows/forge.yml`).

## Architecture

Stack:

- Astro 7 + `@astrojs/cloudflare`, SSR mode; static assets served free/unlimited
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Zod v4 for content collection and Plex movie metadata schema validation
- Islands (plain TS, no framework):
  - `src/components/header-nav.ts` — mobile `<dialog>` navigation menu +
    persisted light/dark theme toggle
  - `src/components/movie-filter.ts` — instant client-side search, format chip
    filter (`All`, `4K UHD`, `Blu-ray`, `DVD`, `Digital`), genre filter, and
    sort (`sortTitle`, `userRating`, `year`)
- Portability boundary: `src/lib/runtime.ts`, `src/lib/adapters/*`
  (`db.ts`, `blobs.ts`, `mail.ts`), and `src/env.d.ts` ready for future D1/R2
  milestones

## Pages / routes (MVP)

- `/` — About-style home page (bio, tilted 5-photo strip ready for personal
  photos, primary mobile-friendly menu actions, featured wiki articles, and
  Movie Library shelf snapshot)
- `/movies` — Interactive "Movies We Own" catalog with format chips, search,
  genre filter, and sort
- `/movies/[slug]` — Individual movie spec sheet with Catalyst DescriptionList,
  IMDb/TMDb links, cast, and expandable Plex JSON record
- `/articles` — Chronological directory of all wiki pages, movie lists, and
  blog posts
- `/articles/[slug]` — Markdown article reader (starting with
  `/articles/favorite-movies` and `/articles/how-this-wiki-works`)
- `/api/movies.json` — Portable Plex `MediaContainer.Metadata` JSON export
- `/api/health` — Worker health endpoint

## Milestones

- **M0 (MVP)** — Scaffold Astro 7 + Wrangler + Sandcastle + Pocock skills from
  `recipes`; port Tailwind Plus Spotlight + Catalyst UI Kit with MD3 touch
  ergonomics; ship About home page (`/`), Plex-portable movie library
  (`/movies`, `/movies/[slug]`, `/api/movies.json`), and Markdown wiki/articles
  (`/articles`, `/articles/favorite-movies`); deploy to `benalloway.com` with
  CI auto-deploy on merges to `main`.
- **M1** — Replace Spotlight placeholder photos with personal photography and
  expand physical disc inventory.
- **M2** — Provision Cloudflare D1 (`benalloway-db`) + R2 (`benalloway-media`)
  for dynamic movie/wiki CRUD and poster caching.
- **M3** — Automated Plex Media Server webhook / Tautulli metadata sync.
- **M4** — Magic-link admin authentication (via `mail.ts` + Resend) for in-browser
  page editing and shelf additions.
