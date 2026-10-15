# CHANGES — production log

What is live. One entry per production deploy or schema change, newest first,
in the same PR/commit that changes production. Keep it terse: Change / Verify / Rollback.

Verify uses: `production = https://benalloway.com`.
Rollback for a bad worker deploy: `npx wrangler rollback` (immediately reverts to
the previous version).

---

## 2026-10-15 — Centralized `@benalloway/ui` design system + Docker-free / GitHub Actions Sandcastle (ADR-0001, ADR-0004)

Change: Consolidated all design standards (typography, buttons, badges, links,
cards, description lists, inputs, filter chips, stats, disclosures) into
`@benalloway/ui` (`v0.2.0`) and vendored into `src/components/ui/` +
`src/styles/global.css` via `scripts/sync-ui.sh`; extracted `MovieCard`,
`MovieArtwork`, and `MovieShelfCard` components; refactored all pages and
layouts to compose `src/components/ui/*` primitives. Upgraded `.sandcastle/main.ts`
to run Docker-free by default (`noSandbox()` + git worktrees) and added
`.github/workflows/sandcastle.yml` (`npm run sandcastle:gh` / `Sandcastle` +
`ready-for-agent` label trigger) for running Sandcastle on GitHub Actions.

Verify: `npm run check` + `npm run build` + `npm run sandcastle` green; live
200s across `/`, `/movies`, `/movies/the-fellowship-of-the-ring`, `/articles`,
`/articles/favorite-movies`, `/api/movies.json`, and `/api/health`.

Rollback: `npx wrangler rollback` (UI component refactor + automation only; no schema change).

---

## Unreleased — Apex URL architecture + recipes link (ADR-0005)

Change: Home-page Recipes entry now points at `/recipes` (apex subpath)
instead of the subdomain; recorded the site URL architecture (subpaths for
sections, subdomains for services, subdomain 301 alias kept) in ADR-0005.

Verify: `npm run check` + `npm run build` green; home-page Recipes button
lands on `https://benalloway.com/recipes/` (200).

Rollback: `npx wrangler rollback` (link + docs only).

---

## 2026-10-15 — Oatmeal reskin + two-item nav (ADR-0004)

Change: Reskinned visuals/elements only to Oatmeal olive-instrument
(olive tokens, Instrument Serif display + Inter, rounded-full pill buttons,
tonal badges, sticky olive navbar, full-screen olive mobile menu; layouts,
routes, and Plex data untouched). Reduced header + footer nav to exactly
`Movies` (`/movies`) + `Articles` (`/articles`).

Verify: `npm run check` + `npm run build` green; Playwright desktop + mobile
screenshots of `/`; `curl` 200s for `/`, `/movies`,
`/movies/the-fellowship-of-the-ring`, `/articles`,
`/articles/favorite-movies`, `/api/movies.json`.

Rollback: `npx wrangler rollback` (visuals + nav config only; no schema change).

---

## 2026-10-15 — M0: initial launch of benalloway.com

Change: Scaffolded `benalloway-dot-com` from `benalloway/recipes` framework
(Astro 7 SSR + `@astrojs/cloudflare` + Tailwind CSS v4 + Sandcastle + Pocock
skills); ported Tailwind Plus Spotlight layout/typography + Catalyst UI Kit
badges/buttons/description-lists with MD3 mobile touch targets (`min-h-11` /
`min-h-12` + `TouchTarget` expansion) and plain-TS islands (`header-nav.ts`,
`movie-filter.ts`); shipped About home page (`/`), Plex-portable movie
collection (`/movies`, `/movies/[slug]`, `/api/movies.json`), Markdown wiki &
articles (`/articles`, `/articles/favorite-movies`,
`/articles/how-this-wiki-works`), and `/api/health`. Custom domains `benalloway.com` and `www.benalloway.com` attached; Cloudflare zone `always_use_https` enabled (301 HTTP → HTTPS redirect).

Verify: `npm run check` + `npm run build` green; `curl -s https://benalloway.com/api/health` → `{"ok":true,...}`; `/`, `/movies`, `/movies/the-fellowship-of-the-ring`, `/articles`, `/articles/favorite-movies`, and `/api/movies.json` all return 200.

Rollback: `npx wrangler deployments list` → `npx wrangler rollback`.
