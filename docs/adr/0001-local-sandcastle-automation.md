# ADR 0001 — fully local Sandcastle automation

Date: 2026-10-15
Status: accepted

## Context

This repository adopts the exact engineering and automation workflow proven in
`benalloway/recipes`: local Sandcastle orchestration paired with `mattpocock/skills`.

## Decision

Adopt the upstream shape 1:1 for everything outside the app:

- `.sandcastle/` is the canonical `parallel-planner-with-review` template
  (planner → parallel implementers → per-branch reviewer → merger), with
  Docker and GitHub Issues (`Sandcastle` label).
- Triage vocabulary is the five canonical roles (`needs-triage`,
  `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) plus
  `bug`/`enhancement` and the `Sandcastle` backlog label.
- Domain docs follow the single-context layout (`GLOSSARY.md` + `docs/adr/`).
- GitHub Actions runs CI only (`check` + `build`, deploy on `main`).
  No agent runs in the cloud.

## Consequences

- AFK runs happen on the owner machine via `npm run sandcastle`.
- Merges to `main` automatically deploy to `benalloway.com` via `.github/workflows/ci.yml`.
- `.sandcastle/CODING_STANDARDS.md` carries stack and design invariants so the
  reviewer enforces them on every branch.
