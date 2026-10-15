# ADR 0004 — Oatmeal visual language (olive-instrument)

Date: 2026-10-15
Status: accepted (supersedes ADR-0002 visuals only — layouts, IA, islands, and
Plex schema are unchanged)

## Context

Owner feedback: Spotlight's zinc/teal pill-nav aesthetic is not the preferred
look. The preferred visual language is Tailwind Plus **Oatmeal
(olive-instrument)**: warm olive tonal surfaces, Instrument Serif display type
paired with Inter, and rounded-full pill buttons.

Per owner direction this ADR covers **visuals and elements only, not layouts**:
page structure, IA, and component boundaries stay as built.

## Decision

Reskin to Oatmeal olive-instrument elements, ported to Astro (no React /
Elements runtime):

- **Tokens** (`src/styles/global.css` `@theme`): `--color-olive-50…950`,
  `--font-display: 'Instrument Serif'`, `--font-sans: 'Inter'`;
  page base `bg-olive-100 dark:bg-olive-950`; prose recolored to
  `text-olive-700 / headings olive-950` (dark: `olive-400 / white`).
- **Centralized UI Kit (`@benalloway/ui` → `src/components/ui/`):** All
  typography (`Heading`, `Subheading`, `Eyebrow`, `Text`, `Link`, `Code`),
  buttons (`Button`), badges (`Badge`, `AnnouncementBadge`), surfaces (`Card`,
  `Divider`, `Stat`, `Disclosure`, `EmptyState`), metadata lists
  (`DescriptionList`, `DescriptionTerm`, `DescriptionDetails`), and Ecommerce
  catalog/filter controls (`FilterChip`, `TextInput`, `SelectInput`, `PageHeader`,
  `Container`, `Section`) live in `@benalloway/ui` (`../ui`) and are vendored into
  `src/components/ui/` and `src/styles/global.css` via `scripts/sync-ui.sh`.
  App-level compositions (`MovieCard`, `MovieArtwork`, `MovieShelfCard`,
  `ArticleCard`, `ArticleLayout`, `SimpleLayout`, `Header`, `Footer`) compose
  these primitives so design standards are set and adjusted in one place.
- **Nav IA (reduced):** header + footer expose exactly two sections —
  `Movies` (`/movies`) and `Articles` (`/articles`). The `Ben Alloway`
  wordmark links home (`/`); the favorite-movies essay remains reachable via
  `/articles` and the home page (no dedicated `Favorites` nav item).
- **Kept from ADR-0002:** zero-framework islands (`header-nav.ts`,
  `movie-filter.ts`), Catalyst `TouchTarget` hit-area expansion, MD3
  `min-h-11` / `min-h-12` touch targets, class-based dark mode, Plex schema
  (ADR-0003).

## Consequences

- Switching olive ↔ mist is a token-only change (`--color-olive-*` ↔
  `--color-mist-*` in `global.css`).
- No layout, routing, content-collection, or movie-data migration was required.
