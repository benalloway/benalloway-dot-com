# Contributing (human side)

This repo is built by agents, directed by humans. The whole flow:

```
idea → plan session → issue (needs-triage) → /triage → ready-for-agent + Forge
  → runs automatically on GitHub Actions (or locally via `npm run forge` without Docker)
  → merges + deploys → verify live
```

## Plan the issue

Start a plan session (`/grill-with-docs`) and write the issue with
`/to-spec` + `/to-tickets`: vertical tracer-bullet slices, each with blocking
edges. New issues land in `needs-triage` with the `Forge` label if
Forge should pick them up — automation ignores them until triaged.

## Triage: the `ready-for-agent` bar

`/triage` moves issues through `needs-triage` → `needs-info` /
`ready-for-agent` / `ready-for-human` / `wontfix` (with `bug`/`enhancement`).
`ready-for-agent` means **"go build this unattended"** — labeling an issue
with both `Forge` and `ready-for-agent` automatically triggers the
GitHub Actions Forge workflow (or gets picked up on the next local run).
Don't apply it by hand on a guess; grill the spec first (goal, acceptance,
blocking edges, single scope, no open questions).

**Where does it run?** Triage sets routing alongside `ready-for-agent`
(see `docs/agents/triage-labels.md`): no routing label (or `run:cloud`) runs
on cloud Actions automatically; add `run:home` and the home server
(`thinkcentre-m73`) picks it up instead while cloud skips it. From your
phone: create the issue from the Agent-task template, grill it, triage to
`ready-for-agent`, and add `run:home` only if you want the home server.

## Run the factory (Docker-free local OR GitHub Actions)

### Option A — On GitHub Actions (zero laptop CPU/RAM)

1. Add `OPENCODE_API_KEY` to GitHub repository secrets once (strongly
   recommended: also `FORGE_GH_TOKEN`, a fine-grained PAT, for reliable PR
   delivery — see `.github/workflows/README.md`).
2. Either label an issue `Forge` + `ready-for-agent`, or trigger manually:

```sh
npm run forge:gh         # run on GitHub Actions (wrapper default delivery)
npm run forge:gh:pr      # run on GitHub Actions and open a PR (safe default)
```

### Option B — Locally without Docker (git worktrees)

No Docker daemon is needed. Forge uses `noSandbox()` with isolated git
worktrees under `.sandcastle/worktrees/` and your host `opencode` + `gh` CLI:

```sh
npm run forge
```

(If you ever want Docker or Podman containers instead, pass
`FORGE_SANDBOX=docker npm run forge`.)

Up to `FORGE_MAX_ITERATIONS` plan → execute → merge cycles. The planner picks
unblocked `Forge` issues, implementers build each on `forge/issue-{id}`,
reviewers refine per `.sandcastle/CODING_STANDARDS.md`, the merger merges
completed branches, delivers (PR by default), and closes their issues
(`Completed by Forge`). Follow along in the terminal or the Actions run log.

## After a run

Review the merged result (`git log`, `npm run check` + `npm run build`,
`npm run preview` smoke). Merges to `main` deploy to `https://benalloway.com`.
Verify live (`CHANGES.md` top entry tells you what to check).

Workflow details: [`AGENTS.md`](./AGENTS.md) (agent protocol),
[`.forge/`](./.forge) (vendored factory — never hand-edit),
[`GLOSSARY.md`](./GLOSSARY.md) + [`docs/adr/`](./docs/adr/) (vocabulary/decisions).
