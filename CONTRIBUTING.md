# Contributing (human side)

This repo is built by agents, directed by humans. The whole flow:

```
idea → plan session → issue (needs-triage) → /triage → ready-for-agent + Sandcastle
  → runs automatically on GitHub Actions (or locally via `npm run sandcastle` without Docker)
  → merges + deploys → verify live
```

## Plan the issue

Start a plan session (`/grill-with-docs`) and write the issue with
`/to-spec` + `/to-tickets`: vertical tracer-bullet slices, each with blocking
edges. New issues land in `needs-triage` with the `Sandcastle` label if
Sandcastle should pick them up — automation ignores them until triaged.

## Triage: the `ready-for-agent` bar

`/triage` moves issues through `needs-triage` → `needs-info` /
`ready-for-agent` / `ready-for-human` / `wontfix` (with `bug`/`enhancement`).
`ready-for-agent` means **"go build this unattended"** — labeling an issue
with both `Sandcastle` and `ready-for-agent` automatically triggers the
GitHub Actions Sandcastle workflow (or gets picked up on the next local run).
Don't apply it by hand on a guess; grill the spec first (goal, acceptance,
blocking edges, single scope, no open questions).

## Run the factory (Docker-free local OR GitHub Actions)

### Option A — On GitHub Actions (zero laptop CPU/RAM)

1. Add `OPENCODE_API_KEY` to GitHub repository secrets once.
2. Either label an issue `Sandcastle` + `ready-for-agent`, or trigger manually:

```sh
npm run sandcastle:gh      # run on GitHub Actions and push merged commits to main
npm run sandcastle:gh:pr   # run on GitHub Actions and open a PR instead
```

### Option B — Locally without Docker (git worktrees)

No Docker daemon is needed. Sandcastle uses `noSandbox()` with isolated git
worktrees under `.sandcastle/worktrees/` and your host `opencode` + `gh` CLI:

```sh
npm run sandcastle
```

(If you ever want Docker or Podman containers instead, pass
`SANDCASTLE_SANDBOX=docker npm run sandcastle`.)

Up to 10 plan → execute → merge cycles. The planner picks unblocked
`Sandcastle` issues, implementers build each on `sandcastle/issue-{id}`,
reviewers refine per `.sandcastle/CODING_STANDARDS.md`, the merger merges
completed branches and closes their issues (`Completed by Sandcastle`).
Follow along in the terminal and `.sandcastle/logs/`.

## After a run

Review the merged result (`git log`, `npm run check` + `npm run build`,
`npm run preview` smoke). Merges to `main` deploy to `https://benalloway.com`.
Verify live (`CHANGES.md` top entry tells you what to check).

Workflow details: [`AGENTS.md`](./AGENTS.md) (agent protocol),
[`.sandcastle/main.ts`](./.sandcastle/main.ts) (factory),
[`GLOSSARY.md`](./GLOSSARY.md) + [`docs/adr/`](./docs/adr/) (vocabulary/decisions).
