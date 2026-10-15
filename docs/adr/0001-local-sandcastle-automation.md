# ADR 0001 — Docker-free local & GitHub Actions Sandcastle automation

Date: 2026-10-15
Status: accepted

## Context

`benalloway-dot-com` uses `@ai-hero/sandcastle` (`parallel-planner-with-review`)
paired with `mattpocock/skills`. Running Docker containers locally on the
developer laptop is heavy and undesirable, so we need Sandcastle to run:

1. **Locally without Docker**, using native git worktrees and host `opencode` / `gh`.
2. **In GitHub Actions**, so AFK agent runs can execute in the cloud on GitHub's
   ephemeral `ubuntu-latest` runner VMs (triggered automatically when an issue
   is labeled `Sandcastle` + `ready-for-agent`, or manually via `npm run sandcastle:gh`).

## Decision

- `.sandcastle/main.ts` defaults to `noSandbox()` (`@ai-hero/sandcastle/sandboxes/no-sandbox`)
  instead of `docker()`. Parallel issues are still isolated in their own git
  worktrees (`.sandcastle/worktrees/sandcastle-issue-{id}`) via
  `sandcastle.createSandbox()`, with `node_modules` copied into each worktree.
- Container providers remain opt-in via `SANDCASTLE_SANDBOX=docker` or
  `SANDCASTLE_SANDBOX=podman`.
- `.sandcastle/main.ts` wraps `sandcastle.opencode()` to pass OpenCode v1.18+'s
  `--auto` flag and `OPENCODE_PERMISSION='{"*":"allow"}'` for unattended runs,
  and performs a fast `gh issue list` pre-check before spinning up an LLM planner.
- `.github/workflows/sandcastle.yml` runs `.sandcastle/main.ts` on `ubuntu-latest`
  when an issue is labeled `Sandcastle` + `ready-for-agent` or via
  `workflow_dispatch` (`npm run sandcastle:gh` / `npm run sandcastle:gh:pr`),
  gates on `npm run check && npm run build`, pushes to `main` (or opens a PR),
  and deploys to `benalloway.com`.

## Consequences

- `npm run sandcastle` works immediately on the laptop with zero Docker daemon.
- `npm run sandcastle:gh` (or labeling an issue `Sandcastle` + `ready-for-agent`)
  offloads agent execution entirely to GitHub Actions.
- `.sandcastle/CODING_STANDARDS.md` carries stack and design invariants so the
  reviewer enforces them on every branch.
