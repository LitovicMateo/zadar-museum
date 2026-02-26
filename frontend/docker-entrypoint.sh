#!/bin/sh
set -e

# If node_modules is missing or empty (common when a named volume is mounted),
# install dependencies into the mounted volume so `vite` and other binaries are available.
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "Installing node modules into mounted volume..."
  npm ci --no-audit --progress=false --unsafe-perm=true
fi

exec "$@"
