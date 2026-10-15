# Bootstrap — replicate this setup in a new repo

This repo doubles as the template: Docker-free local + GitHub Actions Forge
factory + OpenCode skills + `@benalloway/ui` vendored design system + free-tier
Cloudflare architecture, all portable. Follow these steps; the per-repo
checklist at the end is the only bespoke part.

What you get: `parallel-planner-with-review` AFK loop (`planner` → parallel
`implementer` + `reviewer` in git worktrees → `merger`), Pocock skills wired to
canonical docs (`GLOSSARY.md` + `docs/adr/`), `@benalloway/ui` vendoring via
`scripts/sync-ui.sh`, Astro SSR + D1/R2 behind a portability boundary, and
GitHub Actions workflows for both CI/CD (`ci.yml`) and cloud agent runs
(`forge.yml`, via reusable `benalloway/forge`).

## 1. Prereqs

- GitHub repo (private is fine), `gh` CLI authed
- OpenCode CLI (`npm install -g opencode-ai@latest`) with an API key (`OPENCODE_API_KEY`)
- Cloudflare account (free tier covers Workers 100k req/day, D1 5 GB,
  R2 10 GB); Node 24; `npx wrangler` access (no Docker required!)

## 2. Copy these files

| Copy | Role |
| ---- | ---- |
| Factory via Forge | Follow Forge `docs/INSTALL.md` (labels, `.forge/` vendor, `forge.yml` wrapper, secrets) — do not copy factory files by hand |
| `.sandcastle/CODING_STANDARDS.md` | Reviewer standards (fill per repo; path is Forge's default) |
| `.github/workflows/ci.yml` | CI (`check` + `build`, auto-deploy on `main`) |
| `.github/ISSUE_TEMPLATE/` (wayfinder templates + `agent-task.md`) | Spec format + wayfinder map/ticket templates |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR format (summary, evidence, merge-danger) |
| `scripts/sync-ui.sh`, `scripts/ui-version.txt` | Vendors `@benalloway/ui` (`../ui`) into `src/components/ui/` + `src/styles/global.css` |
| `AGENTS.md`, `CONTRIBUTING.md` | Agent protocol + human flow (adapt the stack section per repo) |
| `GLOSSARY.md`, `docs/adr/`, `docs/agents/` | Canonical skill config: vocabulary, decisions, tracker rules |
| `skills-lock.json` + `npx skills update` | Pinned Pocock skill catalog (full set); or reinstall: `npx skills@latest add mattpocock/skills -y` (installs to `.agents/skills/`). Keep vendored files byte-pristine |
| `scripts/setup-labels.sh` | Canonical label vocabulary (run it) |
| `src/lib/runtime.ts`, `src/lib/adapters/*`, `src/env.d.ts` | Portability boundary pattern (adapt bindings per app) |
| `wrangler.jsonc` | Bindings + routes + `platformProxy` dev (adapt names/ids) |

## 3. Labels & secrets

Labels: Forge `docs/INSTALL.md` Step 1 (idempotent loop, includes `Forge` +
triage roles).

GitHub Repository Secrets:
- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (`ci.yml` deploy steps)
- `OPENCODE_API_KEY` (`forge.yml` cloud agent runner)
- `FORGE_GH_TOKEN` (strongly recommended fine-grained PAT for reliable PR
  delivery; falls back to `GITHUB_TOKEN`)

App runtime secrets never go in the repo: local via `.dev.vars` (gitignored),
production via `npx wrangler secret put <NAME>` (human-owned session; agents
never handle tokens).

## 4. Cloudflare free-tier setup (human, once)

```sh
npx wrangler login                                   # human-owned session
npx wrangler d1 create <db-name>                     # paste id into wrangler.jsonc
npx wrangler r2 bucket create <bucket>               # enable R2 in dashboard first (one-time click)
```

Custom domain: Worker → Domains (route already in `wrangler.jsonc`).

## 5. Per-repo checklist (the only bespoke part)

- [ ] `PLAN.md`: architecture, schema, milestones, design language
- [ ] `GLOSSARY.md`: domain vocabulary (+ `docs/adr/` for decisions)
- [ ] `.sandcastle/CODING_STANDARDS.md`: stack + style + testing rules
- [ ] `wrangler.jsonc`: names, ids, routes; `ci.yml` D1 database name
- [ ] `package.json` scripts (`dev/check/build/preview/ui:sync`, plus `forge*` from Forge INSTALL Step 5)
- [ ] `scripts/seed.sql` if the app needs seeds (idempotent `INSERT OR IGNORE`)
- [ ] Product labels beyond the automation set (`post-mvp`, area tags…)

## 6. Operating

Triage tickets to `ready-for-agent` (with the `Forge` label to include
them in the plan):
- **On GitHub Actions:** happens automatically when both labels are present, or run `npm run forge:gh` / `npm run forge:gh:pr`.
- **Locally (Docker-free):** run `npm run forge` from the branch you want merged into.
