#!/usr/bin/env bash
# Vendor @benalloway/ui (pinned in scripts/ui-version.txt) into this repo.
# Committed copies keep deploys hermetic and diffs reviewable.
set -euo pipefail

UI_SHA=$(cat scripts/ui-version.txt)
UI_DIR="${UI_CHECKOUT:-../ui}"

if [ ! -d "$UI_DIR/.git" ]; then
  echo "ui checkout not found at $UI_DIR (override with UI_CHECKOUT=...)" >&2
  exit 1
fi

if [ -z "$(git -C "$UI_DIR" status --porcelain)" ]; then
  git -C "$UI_DIR" fetch origin --tags >/dev/null 2>&1 || true
  git -C "$UI_DIR" checkout "$UI_SHA" --quiet
fi

mkdir -p src/components/ui
cp "$UI_DIR/src/styles/oatmeal.css" src/styles/global.css
cp "$UI_DIR"/src/components/*.astro src/components/ui/
cp "$UI_DIR/src/lib/formatDate.ts" src/lib/formatDate.ts

echo "vendored ui from $UI_DIR (pinned $UI_SHA)"
