#!/bin/bash
set -e

# Resolve paths relative to this script, so it works whether called from
# apps/api/ (rootDirectory=apps/api) or the repo root (no rootDirectory).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# .vercel/output is created relative to CWD (wherever Vercel runs the build from)
mkdir -p .vercel/output/functions/api/index.func
mkdir -p .vercel/output/static

# Bundle entire API into a single file targeting Node.js
bun build "$APP_DIR/src/index.ts" --outfile .vercel/output/functions/api/index.func/index.mjs --target node

# Serverless function config
cat > .vercel/output/functions/api/index.func/.vc-config.json << 'CONF'
{
  "runtime": "nodejs20.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs"
}
CONF

# Output config: route all requests to the API function
cat > .vercel/output/config.json << 'CONF'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/api" }
  ]
}
CONF

echo "Vercel build output created at $(pwd)/.vercel/output/"
