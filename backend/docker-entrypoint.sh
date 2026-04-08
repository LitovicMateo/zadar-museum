#!/bin/sh
set -e

# If node_modules is missing or incomplete (common when a named volume is mounted),
# install dependencies into the mounted volume so strapi and other binaries are available.
if [ ! -x node_modules/.bin/strapi ]; then
  echo "Installing node modules into mounted volume..."
  npm ci --no-audit --progress=false
fi

exec "$@"
