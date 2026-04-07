#!/bin/sh
set -e

# If node_modules is missing or empty (common when a named volume is mounted),
# or if a dev-only plugin like @vitejs/plugin-react is missing, install deps
# into the mounted volume so `vite` and other binaries/packages are available.
if ! node -e "require.resolve('@vitejs/plugin-react')" >/dev/null 2>&1 || [ ! -x node_modules/.bin/vite ]; then
  echo "Installing node modules into mounted volume (missing vite or @vitejs/plugin-react)..."
  NODE_ENV=development npm ci --no-audit --progress=false --unsafe-perm=true
fi

exec "$@"
