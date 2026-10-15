# ADR 0005 — Site URL architecture: subpaths for content, subdomains for standalone apps

Date: 2026-10-15
Status: accepted
Supersedes: 2026-10-15 apex-path consolidation decision (subdomain→apex 301 direction reversed)

## Context

`benalloway.com` hosts a public editorial personal site (wiki/movies content,
this worker) alongside a private signed-in recipe app (recipes worker, separate
repo `benalloway/recipes`). QA on production showed they cannot share one host
as path-mounted sections of a single site:

1. `benalloway.com/recipes` vs `benalloway.com/recipes/` behaved as different
   login states (RFC 6265 §5.1.4: a session cookie with `Path=/recipes/` is
   omitted by browsers on bare `/recipes`, so one URL resumed the session and
   the other showed logged-out).
2. Once inside the Recipes app there is no elegant way back to
   `benalloway.com` — the two share an identical marketing header but are
   different products (public editorial personal site vs private signed-in
   recipe app), so the shared shell reads as one site but behaves as two.

Decision (owner-approved): treat them as separate products.

## Decision

- **Content sections of the apex stay on subpaths (this worker):** `/movies`,
  `/articles`. No app code mounts under `benalloway.com/recipes*` anymore.
- **Standalone apps with their own auth/security posture live on subdomains:**
  `recipes.benalloway.com` (recipes worker, own host, own `Path=/` auth
  cookie, own compact app shell — implemented in `benalloway/recipes`).
- **Canonical move + permanent redirect:** `benalloway.com/recipes*` 301s to
  `https://recipes.benalloway.com/*` via the zone redirect rule
  (`apex-path consolidation`, ref `recipes-subdomain-to-apex-path` — rule
  direction reversed from the earlier subdomain→apex alias). Keep the redirect
  forever — the canonical choice stays reversible. The old
  `recipes.benalloway.com → benalloway.com/recipes` direction is reversed and
  no longer applies.
- **Subdomains remain reserved for services too:** APIs, webhooks,
  staging/preview deployments, or anything with a different auth/security
  posture.
- **Known trade-offs (accepted):** apex-path deep links (`benalloway.com/recipes*`)
  now cost one 301 hop to the subdomain (bookmarks keep working, crawlers
  re-index to the canonical host); the apex worker must not re-mount
  `/recipes*` or it will shadow the redirect — verify both hosts after every
  routing change.

## Consequences

- New section-style content mounts as `benalloway.com/<section>*` path routes
  on this worker; new standalone apps with their own auth/security posture get
  subdomains.
- The routing table lives here: this ADR + each app's `wrangler.jsonc`
  `routes` + the zone redirect ruleset. All three must agree.
