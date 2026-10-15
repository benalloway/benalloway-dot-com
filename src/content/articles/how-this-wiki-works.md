---
title: "How This Wiki & Movie Library Works"
description: "Architecture notes on benalloway.com — Astro 7 SSR on Cloudflare Workers, Tailwind Plus Spotlight & Catalyst, and Plex-portable movie metadata."
category: "Wiki"
publishedAt: "2026-10-15"
tags: ["architecture", "wiki", "plex", "cloudflare"]
featured: true
---

This site is built to be fast on mobile, effortless to maintain, and 1:1 aligned with our `recipes` engineering workflow.

## Adding a New Wiki Page, List, or Blog Post

Every page under `/articles` is a standard Markdown file inside `src/content/articles/`. To publish a new article or wiki entry, create `src/content/articles/<slug>.md` with frontmatter:

```markdown
---
title: "Top 100 Movies of All Time"
description: "The expanded canon with notes on every film."
category: "Movies"
publishedAt: "2026-10-20"
tags: ["movies", "top-100"]
featured: true
---

Write standard Markdown here...
```

Valid `category` values are `Movies`, `Wiki`, `Life Updates`, and `Notes`. Merging to `main` automatically runs typechecks, builds the Astro bundle, and deploys to `benalloway.com`.

## Adding Movies with Plex-Portable Metadata

Movies live in `src/data/movies.ts` and are validated against `MovieSchema` (Zod). Field names match Plex Media Server's `Metadata` schema (`title`, `sortTitle`, `originalTitle`, `year`, `contentRating`, `duration`, `studio`, `editionTitle`, `userRating`, and `guids` using `imdb://` and `tmdb://` URIs):

- The interactive shelf lives at [`/movies`](/movies).
- Every film gets its own detail page at `/movies/<slug>` with physical A/V transfer specs and an expandable Plex JSON record.
- The entire library is also exported at [`/api/movies.json`](/api/movies.json) in Plex's `MediaContainer.Metadata` format so it can be imported into D1 or synced with Plex later without reshaping any data.
