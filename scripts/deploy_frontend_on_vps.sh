#!/usr/bin/env bash
set -euo pipefail

# deploy_frontend_on_vps.sh
# Usage: run on the VPS inside the repo root that contains docker-compose.vps.yml
# Adjust APP_DIR if your repo is in a different location.

APP_DIR="/root/zadar-museum"
COMPOSE_FILE="docker-compose.vps.yml"
FRONTEND_SERVICE="frontend"
BACKEND_SERVICE="backend"
FRONTEND_CONTAINER_NAME="react_prod"

if [ ! -f "$APP_DIR/$COMPOSE_FILE" ]; then
  echo "ERROR: $APP_DIR/$COMPOSE_FILE not found. Adjust APP_DIR or copy the script to the repo root and run from there."
  exit 2
fi

cd "$APP_DIR"

echo "Pulling latest images (frontend + backend if present)..."
docker-compose -f "$COMPOSE_FILE" pull --ignore-pull-failures "$FRONTEND_SERVICE" "$BACKEND_SERVICE" || true

echo "Stopping and removing old frontend container (if exists)..."
docker rm -f "$FRONTEND_CONTAINER_NAME" 2>/dev/null || true

echo "Recreating frontend and nginx services..."
# Recreate frontend and nginx (no-deps so we don't restart DB unnecessarily)
docker-compose -f "$COMPOSE_FILE" up -d --no-deps --force-recreate "$FRONTEND_SERVICE" nginx

echo "Forcing backend recreate so it picks up updated envs (CORS_ORIGINS etc.)..."
docker-compose -f "$COMPOSE_FILE" up -d --no-deps --force-recreate "$BACKEND_SERVICE"

echo "Waiting a few seconds for containers to settle..."
sleep 5

echo "Current container status:"
docker ps -a --format 'table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}'

echo "To verify CORS from this machine run (replace domain/origin as needed):"
echo "curl -i -X OPTIONS \"https://ovdjejekosarkasve.com/api/auth/local\" -H \"Origin: https://ovdjejekosarkasve.com\" -H \"Access-Control-Request-Method: POST\""

echo "Done. If nginx fails to start because certificates are missing, check ./certbot/conf and ensure /etc/letsencrypt paths are mounted correctly in the nginx service and certs exist." 
