# AGENTS.md — ground rules for AI agents working in this repo

Purpose: any agent running inside Sandcastle can pick up a `ready-for-agent`
issue and ship commits without hand-holding. Non-negotiable rules first,
context after. 1:1 with `mattpocock/skills` + `mattpocock/sandcastle`
(`parallel-planner-with-review`); app specifics live in `PLAN.md`,
`GLOSSARY.md`, and `.sandcastle/CODING_STANDARDS.md`.

## Source of truth

- `PLAN.md` — architecture, schema, milestones, design language. Do not edit
  milestone definitions without discussing with the owner.
- GitHub issues are the unit of work. The `Sandcastle` label marks the backlog
  the planner reads; triage roles (`needs-triage` → `ready-for-agent` /
  `ready-for-human`) decide what is agent-ready.
- `CONTRIBUTING.md` — human-side flow (idea → triage → Sandcastle → merge).
  `.github/workflows/README.md` — workflow map (CI only; agents run local).
- `GLOSSARY.md` + `docs/adr/` — domain vocabulary and decisions. Use glossary
  terms verbatim; flag ADR conflicts explicitly.

## Stack invariants (do not violate)

- Astro 7 SSR + `@astrojs/cloudflare`. Zero client framework — interactive bits
  are plain TS islands, everything else server-rendered HTML.
- **Portability boundary:** only `src/lib/runtime.ts`, `src/lib/adapters/*`
  (db / blobs / mail), and `src/env.d.ts` may import platform modules or
  platform types. App code never does.
- Runtime config comes from Worker env bindings
  (`import { env } from 'cloudflare:workers'`) — **never `process.env`**.
  Secrets: `.dev.vars` (gitignored) locally, `wrangler secret put` in prod.
  Sandcastle secrets live in `.sandcastle/.env` (gitignored):
  `OPENCODE_API_KEY` + `GH_TOKEN` (fine-grained PAT: Issues RW, Metadata R —
  the sandbox's `gh` uses it to read/close issues). Never add Cloudflare
  account IDs or session keys.
- **Design system (ADR-0002):** Tailwind CSS v4 (`@tailwindcss/vite`) porting
  Tailwind Plus **Spotlight** (zinc/teal palette, framed `max-w-7xl` center
  sheet, floating pill navigation, `.prose-spotlight` editorial typography,
  light/dark mode) + **Catalyst UI Kit** (`Badge`, `Button`, `DescriptionList`,
  filter controls) + **MD3 mobile UX** (`min-h-11` / `48px` touch targets,
  `TouchTarget` hit-area expansion, accessible `<dialog>` mobile menu).
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
npm run sandcastle          # local AFK factory: planner → implementers → reviewers → merger
```

`npm run typecheck` and `npm run test` are aliased to `npm run check` and
`npm run build` so Sandcastle prompts work out of the box.

## Workflow — Sandcastle AFK factory (fully local)

Nothing agent-driven runs in GitHub Actions. The owner runs the factory on
their machine; sandboxes never see credentials (host `gh` auth does all
GitHub operations outside the sandbox where needed, the merger closes issues
from inside via the sandbox `gh` CLI).

0. **Backlog:** issues carrying the `Sandcastle` label are the planner's input.
   Triage (`/triage`) moves specs through `needs-triage` → `needs-info` /
   `ready-for-agent` / `ready-for-human` / `wontfix` with `bug`/`enhancement`.
   Only `ready-for-agent` + `Sandcastle` issues get planned.
1. **Run:** `cp .sandcastle/.env.example .sandcastle/.env` (fill
   `OPENCODE_API_KEY` + `GH_TOKEN` once), build the image once
   (`npx @ai-hero/sandcastle docker build-image`), then
   `npm run sandcastle` from the branch you want merged into
   (usually `main`).
2. **What happens:** up to 10 plan → execute → merge cycles. The planner
   emits `<plan>` JSON with unblocked issues and deterministic
   `sandcastle/issue-{id}` branches. Each issue gets its own sandbox:
   implementer (RGR, commits with `RALPH:` prefix) then reviewer (same
   sandbox, same branch, per `.sandcastle/CODING_STANDARDS.md`). The merger
   merges completed branches into the current branch, runs verification,
   and closes their issues (`Completed by Sandcastle`).
3. **Work rules inside a sandbox:** change only what the issue scopes. Small
   commits, imperative messages. Obey the portability boundary, Worker env
   bindings, Spotlight/Catalyst/MD3 design rules, and Plex metadata schema.
   `npm run check` + `npm run build` green before finishing. Add the
   `CHANGES.md` entry (Change / Verify / Rollback) when production behavior
   changes. Output `<promise>COMPLETE</promise>` when done. Never read or echo
   secrets.
4. **After a run:** review the merged result (`git log`, `npm run check` +
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
