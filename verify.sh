#!/bin/bash
# Preview environment verification script for SimpleShopping
# Branch: feature/pr-123
# Usage: ./verify.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Installing test dependencies..."
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --quiet

echo "==> Running preview verification tests..."
PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright \
  npx playwright test --reporter=list

echo "==> Verification complete."
