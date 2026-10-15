# ADR 0005 — Site URL architecture: subpaths for sections, subdomains for services

Date: 2026-10-15
Status: accepted

## Context

`benalloway.com` hosts multiple apps (wiki/movies content, recipes). Each app
is its own Cloudflare Worker and repo, but they should read as one personal
site rather than scattered islands.

## Decision

- **Content sections of the site live on subpaths of the apex:**
  `/movies`, `/articles` (this worker), `/recipes` (recipes worker via the
  `benalloway.com/recipes*` path route — path specificity beats the apex
  route; verified live with 200s).
- **Subdomains are reserved for services**, not sections: APIs, webhooks,
  staging/preview deployments, or anything with a different auth/security
  posture.
- **Canonical homes + permanent aliases:** `recipes.benalloway.com/*` 301s
  to `benalloway.com/recipes/*` via the zone redirect rule
  (`apex-path consolidation`, ref `recipes-subdomain-to-apex-path`). Keep the
  alias forever — the canonical choice stays reversible.
- **Known trade-offs (accepted):** apex is a single fault domain (one
  worker's bad route can shadow the other — verify both hosts after every
  routing change); the subdomain→apex 301 drops query strings (only affects
  magic links emailed inside a deploy window; they self-heal with a fresh
  link); `/recipes/recipes/:id` reads redundantly (see ADR-0003 in
  `benalloway/recipes`).

## Consequences

- New section-style apps mount as `benalloway.com/<section>*` path routes on
  their own workers with base-aware URLs; new services get subdomains.
- The routing table lives here: this ADR + each app's `wrangler.jsonc`
  `routes` + the zone redirect ruleset. All three must agree.
