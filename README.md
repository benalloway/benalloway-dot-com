# benalloway.com

Personal wiki, Plex-portable movie collection, and articles — `benalloway.com`

- **Stack:** Astro 7 (SSR) + Cloudflare Workers · Tailwind CSS v4 (`@benalloway/ui`: Oatmeal olive-instrument + Catalyst UI Kit + Ecommerce + MD3 UX)
- **Design goal:** instant mobile render, zero framework JS, centralized UI primitives (`src/components/ui/`), effortless Markdown page authoring, 1:1 Plex-compatible movie metadata
- See [PLAN.md](./PLAN.md) for the full build plan and milestone status.

## Local dev

```sh
npm install
npm run dev              # astro dev (bindings proxied from wrangler.jsonc)
npm run build            # production build → dist/
npm run preview          # wrangler dev against the built bundle (same as prod)
npm run check            # astro sync && tsc --noEmit
npm run ui:sync          # vendor latest @benalloway/ui (../ui) into src/components/ui/ + src/styles/global.css
npm run forge            # Docker-free local AFK agent factory (git worktrees + host opencode)
npm run forge:gh         # run Forge AFK factory on GitHub Actions (wrapper default delivery)
npm run forge:gh:pr      # run Forge AFK factory on GitHub Actions (open a PR)
```

## Related repos in this workspace

| Repo | Path / URL | Relationship to `benalloway-dot-com` |
|---|---|---|
| `@benalloway/ui` | `../ui` (`benalloway/ui`) | Canonical source of truth for design tokens (`src/styles/oatmeal.css`) and all 29 Astro UI primitives (`src/components/*.astro`). Edit UI primitives in `../ui`, commit there, then run `npm run ui:sync` (`bash scripts/sync-ui.sh`) here to vendor into `src/components/ui/` and `src/styles/global.css`. |
| `recipes` | `../recipes` (`benalloway/recipes`) | Companion Astro + Cloudflare Workers + D1/R2 app served on `https://recipes.benalloway.com` (ADR-0005; `benalloway.com/recipes*` 301s there), sharing `@benalloway/ui` and the same Forge + Pocock skills workflow. |

## Adding content

- **New wiki page, movie list, or blog post:** add a `.md` file to `src/content/articles/<slug>.md` with frontmatter (`title`, `description`, `category`, `publishedAt`, `tags`, `featured`). It renders automatically at `/articles/<slug>` and in `/articles`.
- **New movie on the shelf:** add an entry to `src/data/movies.ts` (validated by `MovieSchema` with Plex-compatible fields: `title`, `sortTitle`, `year`, `contentRating`, `duration`, `studio`, `editionTitle`, `guids`, `mediaFormat`).

## Portability contract

All Cloudflare glue lives in `src/lib/runtime.ts` + `src/lib/adapters/*`
(db / blobs / mail) and `src/env.d.ts`. Porting to any other host means
reimplementing those files only — nothing else imports platform modules.

## Process (how humans & agents work here)

- **Humans:** [CONTRIBUTING.md](./CONTRIBUTING.md) — idea → issue
  (`needs-triage` + `Forge`) → `/triage` → `ready-for-agent` + `Forge`
  (auto-runs on GitHub Actions or locally via `npm run forge` without Docker) → live deploy.
- **Agents:** [AGENTS.md](./AGENTS.md) — stack invariants, cross-repo `@benalloway/ui`
  vendoring rules, commands, and the Forge factory (`planner` → parallel
  `implementer` + `reviewer` in git worktrees → `merger`).
  Skill/vocabulary config: [`docs/agents/`](./docs/agents/),
  [`GLOSSARY.md`](./GLOSSARY.md), [`docs/adr/`](./docs/adr/).
  Factory: [`.forge/`](./.forge) (vendored — never hand-edit). Workflows (`ci.yml` + `forge.yml`):
  [.github/workflows/README.md](./.github/workflows/README.md).
- **Replicate this setup** in a new repo: [docs/bootstrap.md](./docs/bootstrap.md)
  + Forge [`docs/INSTALL.md`](https://github.com/benalloway/forge/blob/v1/docs/INSTALL.md).
