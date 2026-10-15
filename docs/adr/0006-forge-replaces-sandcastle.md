# ADR 0006 — Forge replaces Sandcastle automation

Date: 2026-10-15
Status: accepted (supersedes ADR-0001)

## Context

ADR-0001 adopted a `.sandcastle/` AFK factory (runner, prompts, workflow,
labels) supporting Docker-free local runs and GitHub Actions delivery. That
factory has since been extracted, generalized, and rebranded as Forge
(`benalloway/forge`, reusable workflow + vendored runner with PR delivery by
default), shared 1:1 with `benalloway/recipes`.

## Decision

- Remove the in-repo Sandcastle runner (`.sandcastle/main.ts`, prompts,
  Dockerfile, `sandcastle.yml`, labels script, npm scripts, dependency).
- Adopt Forge per its `docs/INSTALL.md`: factory vendored into `.forge/`
  (pinned, never hand-edited), `forge.yml` wrapper, `Forge` backlog label,
  PR delivery by default.
- Keep `.sandcastle/CODING_STANDARDS.md` in place — it is repo knowledge, not
  automation, and it is Forge's default reviewer standards path. ADR-0001
  stays as history.

## Consequences

- Factory improvements land via `scripts/sync-forge.sh`, not per-repo edits.
- `OPENCODE_API_KEY` (+ `FORGE_GH_TOKEN` for reliable PR delivery) become repo
  Actions secrets; no agent secrets live in the repo.
- The `Sandcastle` GitHub label is retired once open issues are re-labeled.
