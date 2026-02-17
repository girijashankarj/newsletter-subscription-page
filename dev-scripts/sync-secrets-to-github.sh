#!/usr/bin/env bash
# Sync .env values to GitHub Secrets via gh.
# Run from repo root: ./dev-scripts/sync-secrets-to-github.sh
# Skips empty and PENDING values.
# Prerequisite: gh auth login (gh auth login)

set -e
cd "$(dirname "$0")/.."

if ! command -v gh &>/dev/null; then
  echo "Install gh: https://cli.github.com/"
  exit 1
fi

SECRETS=(
  VITE_NEWSLETTER_SCRIPT_URL
  VITE_AUTHOR_NAME
  VITE_AUTHOR_TITLE
  VITE_PORTFOLIO_URL
  VITE_LINKEDIN_URL
  VITE_GITHUB_URL
  VITE_FOOTER_TAGLINE
  VITE_NEWSLETTER_NAME
  VITE_PAGE_TITLE
)

if [[ ! -f .env ]]; then
  echo ".env not found. Copy .env.example to .env and fill in values."
  exit 1
fi

echo "Syncing .env to GitHub Secrets..."
for name in "${SECRETS[@]}"; do
  val=$(grep -E "^${name}=" .env 2>/dev/null | cut -d= -f2- | sed 's/^["'\'']//;s/["'\'']$//' | tr -d '\r')
  if [[ -z "$val" || "$val" == "PENDING" ]]; then
    echo "⏭  Skipping $name (empty or PENDING)"
  else
    echo "$val" | gh secret set "$name"
    echo "✅ Set $name"
  fi
done
echo ""
echo "Done. Push to main to trigger deploy, or: gh workflow run deploy.yml"
