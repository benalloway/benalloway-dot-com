# AGENTS.md — ground rules for AI agents working in this repo

Purpose: any agent running inside Forge can pick up a `ready-for-agent`
issue and ship commits without hand-holding. Non-negotiable rules first,
context after. 1:1 with `mattpocock/skills`
(`parallel-planner-with-review`); the factory is Forge
(`benalloway/forge@v1`, built on `@ai-hero/sandcastle`); app specifics live
in `PLAN.md`, `GLOSSARY.md`, and `.sandcastle/CODING_STANDARDS.md`.

## Source of truth

- `PLAN.md` — architecture, schema, milestones, design language. Do not edit
  milestone definitions without discussing with the owner.
- GitHub issues are the unit of work. The `Forge` label marks the backlog
  the planner reads; triage roles (`needs-triage` → `ready-for-agent` /
  `ready-for-human`) decide what is agent-ready.
- `CONTRIBUTING.md` — human-side flow (idea → triage → Forge → merge).
  `.github/workflows/README.md` — workflow map (`ci.yml` + `forge.yml`).
- `GLOSSARY.md` + `docs/adr/` — domain vocabulary and decisions. Use glossary
  terms verbatim; flag ADR conflicts explicitly.

## Cross-repo map (`Work/`)

This repo works alongside two sibling repositories under `/home/benalloway/Work`:

- **`@benalloway/ui` (`../ui`, `benalloway/ui`):** Canonical source of truth for
  all shared design tokens (`src/styles/oatmeal.css`) and all 29 Astro UI
  primitives (`src/components/*.astro`). **Never hand-edit files inside
  `src/components/ui/` or `src/styles/global.css` in this repo** — edit them in
  `../ui`, commit in `../ui`, and run `npm run ui:sync` (`bash scripts/sync-ui.sh`)
  here so `scripts/ui-version.txt` and the vendored copies stay in lockstep.
- **`recipes` (`../recipes`, `benalloway/recipes`):** Companion Astro + Cloudflare
  Workers + D1/R2 app served at `https://recipes.benalloway.com` (ADR-0005;
  `benalloway.com/recipes*` 301s there).
  Uses the same `@benalloway/ui` design kit (`scripts/sync-ui.sh`) and the same
  Forge + Pocock skills workflow. Do not modify `../recipes` when working
  on an issue scoped to `benalloway-dot-com`.

## Stack invariants (do not violate)

- Astro 7 SSR + `@astrojs/cloudflare`. Zero client framework — interactive bits
  are plain TS islands, everything else server-rendered HTML.
- **Portability boundary:** only `src/lib/runtime.ts`, `src/lib/adapters/*`
  (db / blobs / mail), and `src/env.d.ts` may import platform modules or
  platform types. App code never does.
- Runtime config comes from Worker env bindings
  (`import { env } from 'cloudflare:workers'`) — **never `process.env`**.
  Secrets: `.dev.vars` (gitignored) locally, `wrangler secret put` in prod.
  Forge secrets are repo Actions secrets (`OPENCODE_API_KEY` +
  `FORGE_GH_TOKEN`); local `npm run forge` uses host `opencode` + `gh`
  auth. Never add Cloudflare account IDs or session keys.
- **Design system (ADR-0004, `@benalloway/ui`):** Tailwind CSS v4
  (`@tailwindcss/vite`) vendored from `@benalloway/ui` (`../ui` via
  `scripts/sync-ui.sh` + `scripts/ui-version.txt`) into `src/components/ui/`
  and `src/styles/global.css`. Combines **Oatmeal olive-instrument** theme
  (olive tokens, Instrument Serif display + Inter, rounded-full pills, tonal
  surfaces) with **Catalyst UI Kit** (`Heading`, `Subheading`, `Text`, `Link`,
  `Code`, `Button`, `Badge`, `AnnouncementBadge`, `DescriptionList`, `Divider`,
  `TextInput`, `SelectInput`) and **Tailwind UI Ecommerce** building blocks
  (`FilterChip`, `Card`, `Stat`, `Disclosure`, `MovieCard`, `MovieArtwork`) +
  **MD3 mobile UX** (`min-h-11` / `48px` touch targets, `TouchTarget` hit-area
  expansion, accessible `<dialog>` mobile menu). Never duplicate typography,
  button, badge, input, or card styles inline in pages — change them once in
  `@benalloway/ui` and re-vendor. Nav IA is `Movies` + `Articles` only.
- **Plex-portable movie metadata (ADR-0003):** Movie entries in
  `src/data/movies.ts` are validated by `MovieSchema` and preserve 1:1 Plex
  `Metadata` field semantics (`title`, `sortTitle`, `originalTitle`, `year`,
  `contentRating`, `duration`, `studio`, `editionTitle`, `userRating`, `guids`).

## Commands

```sh
npm run dev                 # astro dev (bindings via wrangler.jsonc platformProxy)
npm run check               # astro sync && tsc --noEmit  — feedback loop before every commit
npm run build               # astro build
npm run preview             # wrangler dev against built bundle
npm run deploy              # build + wrangler deploy (production!) — see Deploy policy
npm run ui:sync             # vendor @benalloway/ui into src/components/ui/ and src/styles/global.css
npm run forge               # Docker-free local AFK factory (git worktrees + host opencode)
npm run forge:gh            # trigger & watch Forge AFK factory on GitHub Actions (wrapper default delivery)
npm run forge:gh:pr         # trigger & watch Forge AFK factory on GitHub Actions (open PR)
```

`npm run typecheck` and `npm run test` are aliased to `npm run check` and
`npm run build` so Forge prompts work out of the box.

## Workflow — Forge AFK factory (Docker-free local + GitHub Actions)

Forge runs without Docker by default (`noSandbox()` + native git worktrees
under `.sandcastle/worktrees/`) both locally on your laptop and in GitHub
Actions (`.github/workflows/forge.yml`). The factory is vendored from
`benalloway/forge@v1` into `.forge/` (`scripts/sync-forge.sh` +
`scripts/forge-version.txt`) — never hand-edit `.forge/`, improve upstream
and re-vendor. Container mode remains available via `FORGE_SANDBOX=docker`
or `podman`.

0. **Backlog:** issues carrying the `Forge` label are the planner's input.
   Triage (`/triage`) moves specs through `needs-triage` → `needs-info` /
   `ready-for-agent` / `ready-for-human` / `wontfix` with `bug`/`enhancement`.
   Only `ready-for-agent` + `Forge` issues get planned.
1. **Run locally (no Docker):** `npm run forge` from the branch you want
   merged into (usually `main`). Uses host `opencode` + `gh` auth and creates
   an isolated git worktree per issue.
2. **Run on GitHub Actions:** Either:
   - Label an issue with both `Forge` and `ready-for-agent` (triggers
     `forge.yml` automatically), or
   - Run `npm run forge:gh` (wrapper default delivery) or
     `npm run forge:gh:pr` (opens a PR).
   - Required repository secrets in GitHub: `OPENCODE_API_KEY` (and strongly
     recommended `FORGE_GH_TOKEN` for reliable PR delivery).
3. **What happens:** up to `FORGE_MAX_ITERATIONS` (default 10 locally, 5 in
   Actions) plan → execute → merge cycles. The planner emits `<plan>` JSON with
   unblocked issues and deterministic `forge/issue-{id}` branches. Each
   issue gets its own git worktree sandbox: implementer (RGR) then reviewer
   (same worktree, same branch, per `.sandcastle/CODING_STANDARDS.md`). The
   merger merges completed branches into the current branch, runs
   verification, delivers (PR by default; `push` only where the wrapper
   enables it), and closes their issues (`Completed by Forge`).
4. **Work rules inside a sandbox:** change only what the issue scopes. Small
   commits, imperative messages. Obey the portability boundary, Worker env
   bindings, `@benalloway/ui` design rules, and Plex metadata schema.
   `npm run check` + `npm run build` green before finishing. Add the
   `CHANGES.md` entry (Change / Verify / Rollback) when production behavior
   changes. Output `<promise>COMPLETE</promise>` when done. Never read or echo
   secrets.
5. **After a local run:** review the merged result (`git log`, `npm run check` +
   `npm run build`, `npm run preview` smoke). Push when happy. Merges to
   `main` deploy to production via CI.

## Deploy policy

- Merges to `main` automatically deploy to production (`https://benalloway.com`).
  Treat every merge as a release — nothing half-finished goes into `main`.
- Manual `npm run deploy` is a production action: only run it when the issue
  or the owner explicitly authorizes it in-conversation.
- Any branch that changes what's live must add an entry to `CHANGES.md`
  (Change / Verify / Rollback) in the same branch.
- Deploys require an authenticated wrangler/cf session owned by the human.
  Agents must never handle, read, or echo raw API tokens; never read
  `~/.config/cloudflare/` or `.dev.vars`.

## Agent skills

Project skills live in `.agents/skills/` (Pocock set, pinned in
`skills-lock.json`; update with `npx skills update`). Before plan/spec work,
read `GLOSSARY.md` (vocabulary), `docs/adr/` (decisions touching your area),
`docs/agents/issue-tracker.md` (GitHub tracker conventions),
and `docs/agents/triage-labels.md` (the five canonical roles).
