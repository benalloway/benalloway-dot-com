# ADR 0003 — Plex-portable movie metadata schema

Date: 2026-10-15
Status: accepted

## Context

The movie collection on `benalloway.com` starts as an MVP static/SSR catalog of
owned discs (`4K UHD`, `Blu-ray`, `DVD`, `Digital`) and will later connect to a
home Plex Media Server and Cloudflare D1.

## Decision

Model movies in `src/data/movies.ts` (`MovieSchema`, validated via Zod) using
Plex Media Server's `Metadata` field semantics:

- `title`, `sortTitle`, `originalTitle`, `year`, `contentRating`, `duration`
  (minutes, converted to ms in Plex export), `studio`, `tagline`, `summary`,
  `editionTitle`, `userRating` (10-point scale), `directors`, `writers`,
  `genres`, `cast` (`{ name, role }`), and `guids` (`imdb://tt...`, `tmdb://...`).
- Expose `toPlexMetadata(movie)` and `GET /api/movies.json` returning a
  Plex-shaped `MediaContainer.Metadata` payload.

## Consequences

- Adding a movie in MVP requires only adding a typed object in `src/data/movies.ts`.
- Migrating to D1 SQLite or syncing with Plex requires zero field renaming.
