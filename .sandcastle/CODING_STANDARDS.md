# Coding Standards

<!-- The reviewer agent loads this during code review via @.sandcastle/CODING_STANDARDS.md
     so these standards are enforced during review without costing tokens during implementation. -->

## Style (Spotlight + Catalyst + MD3 — see docs/adr/0002-spotlight-catalyst-md3-design-language.md)

- Astro 7 SSR + `@astrojs/cloudflare`. Zero client framework — interactive bits
  are plain TS islands, everything else server-rendered HTML.
- Tailwind CSS v4 (`@tailwindcss/vite`) with Spotlight's zinc/teal palette,
  class-based dark mode (`.dark`), and `.prose-spotlight` typography in
  `src/styles/global.css`.
- Mobile ergonomics (MD3 + Catalyst): every interactive control, nav link, and
  filter chip must maintain a comfortable touch target (`min-h-11` / `min-h-12`
  or Catalyst's `TouchTarget` overlay) and visible focus/active state layers.
- Content authoring: wiki pages, movie lists, and blog posts live in
  `src/content/articles/*.md` and validate against `src/content.config.ts`.
- Movie metadata (ADR-0003): movies in `src/data/movies.ts` must validate
  against `MovieSchema` and preserve Plex-compatible fields (`sortTitle`,
  `editionTitle`, `guids`, `contentRating`, `duration`).

## Testing

- Run `npm run check` (`astro sync && tsc --noEmit`) and `npm run build`
  (`astro build`) until green before committing. Never weaken types or config
  to silence errors.
- Verify visual work with `npm run preview` + `curl` per the ticket's
  acceptance list.

## Architecture

- **Portability boundary:** only `src/lib/runtime.ts`, `src/lib/adapters/*`
  (db / blobs / mail), and `src/env.d.ts` may import platform modules or
  platform types. App code never does.
- Runtime config comes from Worker env bindings
  (`import { env } from 'cloudflare:workers'`) — never `process.env` in `src/`.
- Any change to live behavior adds a `CHANGES.md` entry (Change / Verify /
  Rollback) in the same branch.
