# Workflows

Two GitHub workflows: `CI` (`ci.yml`) and `Sandcastle` (`sandcastle.yml`).
Sandcastle runs Docker-free (native git worktrees via `noSandbox()`) both locally
(`npm run sandcastle`) and in GitHub Actions (`npm run sandcastle:gh`).

| Workflow | Trigger | Does | Guards |
|---|---|---|---|
| `CI` (`ci.yml`) | push to `main`, PRs, manual | `check` + `build`; on `main`: deploy to `benalloway.com` | Required strict-green `build` on `main` |
| `Sandcastle` (`sandcastle.yml`) | issue labeled `Sandcastle` + `ready-for-agent`, or manual (`npm run sandcastle:gh`) | Runs `.sandcastle/main.ts` (`planner` → parallel `implementer` + `reviewer` in git worktrees → `merger`), verifies `check` + `build`, pushes to `main` (or opens PR), and deploys | `concurrency: sandcastle-factory`, `check` + `build` gate before push |

## Required GitHub Secrets for `sandcastle.yml`

- `OPENCODE_API_KEY` — OpenCode API key for agent runs in GitHub Actions
- `CLOUDFLARE_API_TOKEN` & `CLOUDFLARE_ACCOUNT_ID` — for automatic production deploy after pushing to `main`
- `SANDCASTLE_GH_TOKEN` (optional) — fine-grained PAT (`Contents: RW`, `Issues: RW`, `Pull requests: RW`) if you want pushes from `sandcastle.yml` to also trigger downstream workflows; falls back to `GITHUB_TOKEN` automatically.
