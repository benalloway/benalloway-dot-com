# Workflows

Three GitHub workflows: `CI` (`ci.yml`), `Forge` (`forge.yml`, a thin
wrapper over the reusable `benalloway/forge` factory pinned at `v1`), and
`Review` (`review.yml`, a thin wrapper over the reusable
`benalloway/forge` PR review pinned at `v1`).
Agents run locally (`npm run forge`) or in Actions via `forge.yml`
(Docker-free: native git worktrees via `noSandbox()`).

| Workflow | Trigger | Does | Guards |
|---|---|---|---|
| `CI` (`ci.yml`) | push to `main`, PRs, manual | `check` + `build`; on `main`: deploy to `benalloway.com` | Required strict-green `build` on `main` |
| `Forge` (`forge.yml`) | issue labeled `Forge` + `ready-for-agent` (skips `run:home`), or manual (`npm run forge:gh`) | Runs the vendored `.forge/` factory (`planner` → parallel `implementer` + `reviewer` in git worktrees → `merger`), verifies `check` + `build`, delivers (PR by default) | `concurrency: forge-factory`, `check` + `build` gate before delivery |
| `Review` (`review.yml`) | PR opened / synchronized | Read-only review agent (standards + vendored prompt), posts one advisory comment, never pushes | Per-PR concurrency (latest push wins), no blocking gate |

## Routing: cloud vs home server

Triage (`ready-for-agent`) decides *whether* a ticket runs; routing labels
decide *where* (see `docs/agents/triage-labels.md`):

- No routing label (or `run:cloud`) → cloud `forge.yml` picks it up.
- `run:home` → cloud skips it (job `if:` guard); the home-server runner
  (`thinkcentre-m73`) polls `Forge` + `ready-for-agent` + `run:home`.
- Whichever side starts first comments `Claimed by <cloud|home-server>` so
  the other side sees it before starting.

## Delivery guarantees

- The merger records merged issue IDs in `.sandcastle/delivered-issues.txt`
  (gitignored) and closes issues itself only on local runs.
- On GitHub Actions the workflow closes issues after delivery succeeds
  (`push` mode) or comments with the PR link (`pr` mode, PR body carries
  `Closes #…` so merge closes them). A failed run leaves issues open for retry.
- `delivery=pr` needs either “Allow GitHub Actions to create and approve pull
  requests” (repo Settings → Actions → General) or a `FORGE_GH_TOKEN` PAT.

## Required GitHub Secrets for `forge.yml`

- `OPENCODE_API_KEY` — OpenCode API key for agent runs in GitHub Actions
- `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID` — for automatic production deploy after pushing to `main`
- `FORGE_GH_TOKEN` (strongly recommended) — fine-grained PAT (`Contents: RW`, `Issues: RW`, `Pull requests: RW`) so factory pushes trigger downstream workflows and PR creation never depends on the repo setting; falls back to `GITHUB_TOKEN` automatically.
