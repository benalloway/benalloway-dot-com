# benalloway.com

Personal wiki, Plex-portable movie collection, and articles — `benalloway.com`

- **Stack:** Astro 7 (SSR) + Cloudflare Workers · Tailwind CSS v4 (Spotlight + Catalyst UI Kit + MD3 UX)
- **Design goal:** instant mobile render, zero framework JS, effortless Markdown page authoring, 1:1 Plex-compatible movie metadata
- See [PLAN.md](./PLAN.md) for the full build plan and milestone status.

## Local dev

```sh
npm install
npm run dev          # astro dev (bindings proxied from wrangler.jsonc)
npm run build        # production build → dist/
npm run preview      # wrangler dev against the built bundle (same as prod)
npm run check        # astro sync && tsc --noEmit
```

## Adding content

- **New wiki page, movie list, or blog post:** add a `.md` file to `src/content/articles/<slug>.md` with frontmatter (`title`, `description`, `category`, `publishedAt`, `tags`, `featured`). It renders automatically at `/articles/<slug>` and in `/articles`.
- **New movie on the shelf:** add an entry to `src/data/movies.ts` (validated by `MovieSchema` with Plex-compatible fields: `title`, `sortTitle`, `year`, `contentRating`, `duration`, `studio`, `editionTitle`, `guids`, `mediaFormat`).

## Portability contract

All Cloudflare glue lives in `src/lib/runtime.ts` + `src/lib/adapters/*`
(db / blobs / mail) and `src/env.d.ts`. Porting to any other host means
reimplementing those files only — nothing else imports platform modules.

## Process (how work gets done here)

- **Humans:** [CONTRIBUTING.md](./CONTRIBUTING.md) — idea → issue
  (`needs-triage` + `Sandcastle`) → `/triage` → `npm run sandcastle` → push → auto-deploy.
- **Agents:** [AGENTS.md](./AGENTS.md) — stack invariants, commands, and the
  local Sandcastle factory (planner → implementers → reviewers → merger).
  Skill/vocabulary config: [`docs/agents/`](./docs/agents/),
  [`GLOSSARY.md`](./GLOSSARY.md), [`docs/adr/`](./docs/adr/).
  Factory: [`.sandcastle/`](./.sandcastle/). CI only:
  [.github/workflows/README.md](./.github/workflows/README.md).
- **Replicate this setup** in a new repo: [docs/bootstrap.md](./docs/bootstrap.md)
  + [`scripts/setup-labels.sh`](./scripts/setup-labels.sh).
