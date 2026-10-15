# GLOSSARY

Single-context vocabulary for this repo. Skills must use these terms verbatim
and not invent synonyms. See `docs/agents/domain.md` for consumer rules.

- **article**: a Markdown entry in `src/content/articles/*.md` rendered at
  `/articles/[slug]` and indexed on `/articles` (covers wiki pages, curated
  movie lists, notes, and life updates)
- **category**: article classification (`Movies`, `Wiki`, `Life Updates`, `Notes`)
- **movie**: a validated record in `src/data/movies.ts` (`MovieSchema`)
  representing a film owned in the physical/digital collection
- **sortTitle**: Plex-compatible alphabetical sort key (e.g.
  `"Lord of the Rings: The Fellowship of the Ring, The"`)
- **editionTitle**: Plex-compatible release edition label (e.g.
  `"Extended Edition"`, `"Criterion Collection"`, `"Director's Definitive Edition"`)
- **guid**: external agent URI (`imdb://tt...`, `tmdb://...`) matching Plex's
  `Guid` array
- **mediaFormat**: owned disc/file format (`4K UHD`, `Blu-ray`, `DVD`, `Digital`)
- **island**: plain-TS interactive bit (`header-nav.ts`, `movie-filter.ts`),
  zero client framework
- **portability boundary**: `src/lib/runtime.ts`, `src/lib/adapters/*`,
  `src/env.d.ts` — the only files that may import platform modules
- **ui kit (`@benalloway/ui`)**: the single source of truth for design tokens
  (`src/styles/global.css`) and reusable Astro building blocks
  (`src/components/ui/*`), combining Oatmeal olive-instrument visuals with
  Catalyst UI Kit and Tailwind UI Ecommerce primitives (vendored via
  `scripts/sync-ui.sh`)
- **touch target**: MD3 / Catalyst ergonomic minimum (`44–48px` hit area) on all
  interactive mobile controls
