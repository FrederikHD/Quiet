#!/usr/bin/env bash
# Builds the GitHub Pages site into ./site (run from the repository root): the explorer of the latest release at the
# root, and the explorer of the current checkout (develop) under next/. Usage: build-pages.sh <base path>, e.g. /Quiet/.
set -euo pipefail
base="${1:?base path, e.g. /Quiet/}"
tag="$(git tag --list 'v*' --sort=-v:refname | grep -v -- - | head -n 1)" # the latest stable release
rm -rf site && mkdir -p site

echo "Develop → ${base}next/"
EXPLORER_BASE="${base}next/" VITE_EXPLORER_CHANNEL=next npm run build -w quiet-explorer
cp -r packages/quiet-explorer/dist site/next

echo "Release ${tag} → ${base}"
tmp="$(mktemp -d)"
git worktree add --detach "$tmp" "$tag"
(cd "$tmp" && npm ci --no-audit --no-fund && EXPLORER_BASE="$base" VITE_EXPLORER_CHANNEL=release npm run build -w quiet-explorer)
cp -r "$tmp/packages/quiet-explorer/dist/." site/
git worktree remove --force "$tmp"

sed "s|__BASE__|${base}|" packages/quiet-explorer/scripts/pages-404.html > site/404.html
