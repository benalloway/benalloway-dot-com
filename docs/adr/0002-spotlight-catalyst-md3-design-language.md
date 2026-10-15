# ADR 0002 — Tailwind Plus Spotlight + Catalyst UI Kit + MD3 UX

Date: 2026-10-15
Status: accepted

## Context

`benalloway.com` is a personal wiki, movie database, and article site that must
render instantly on mobile devices with zero client framework JS while feeling
modern, editorial, and effortless to navigate on small screens.

## Decision

Combine Tailwind Plus **Spotlight** and **Catalyst UI Kit** with **Material
Design 3 (MD3)** mobile UX ergonomics, ported directly to Astro 7 components
and plain-TS islands:

- **No React / MUI runtime:** Keep the `recipes` zero-framework invariant.
  Spotlight and Catalyst templates are translated into `.astro` components +
  two tiny plain-TS islands (`header-nav.ts`, `movie-filter.ts`).
- **Spotlight Shell & Typography:** Framed `max-w-7xl` center sheet
  (`bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20`),
  floating pill navbar with teal active indicator, tilted photo strip on the
  About home page, and `.prose-spotlight` editorial typography in
  `src/styles/global.css`.
- **Catalyst UI Primitives:** `Badge`, `Button` (with `TouchTarget`),
  `DescriptionList`, and filter controls for structured metadata pages.
- **MD3 Mobile Ergonomics:** Minimum 44–48px (`min-h-11` / `min-h-12`) touch
  targets on all mobile navigation triggers, filter chips, and interactive
  rows; native `<dialog>` sheet for mobile navigation; clear focus/active/pressed
  state layers (`aria-pressed`, `focus:ring-2`).

## Consequences

- Zero React/HeadlessUI bundle shipped to mobile clients.
- Full support for both light and dark themes with zero flash on load.
