# CHANGES — production log

What is live. One entry per production deploy or schema change, newest first,
in the same PR/commit that changes production. Keep it terse: Change / Verify / Rollback.

Verify uses: `production = https://benalloway.com`.
Rollback for a bad worker deploy: `npx wrangler rollback` (immediately reverts to
the previous version).

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
`/articles/how-this-wiki-works`), and `/api/health`. Custom domain
`benalloway.com` attached.

Verify: `npm run check` + `npm run build` green; `curl -s https://benalloway.com/api/health` → `{"ok":true,...}`; `/`, `/movies`, `/movies/the-fellowship-of-the-ring`, `/articles`, `/articles/favorite-movies`, and `/api/movies.json` all return 200.

Rollback: `npx wrangler deployments list` → `npx wrangler rollback`.
