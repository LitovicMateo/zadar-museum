#!/usr/bin/env bash
set -euo pipefail

# Build and push frontend image to GHCR. Usage:
# GITHUB_PAT=ghp_xxx ./scripts/push-frontend-to-ghcr.sh

REPO_OWNER=litovicmateo
IMAGE=ghcr.io/${REPO_OWNER}/zadar-museum-frontend

SHA=$(git rev-parse --short HEAD 2>/dev/null || echo local)

if [ -z "${GITHUB_PAT:-}" ]; then
  echo "Please set GITHUB_PAT environment variable (PAT with packages:write)" >&2
  exit 1
fi

echo "$GITHUB_PAT" | docker login ghcr.io -u "$REPO_OWNER" --password-stdin

echo "Building $IMAGE:$SHA"
docker build -t "$IMAGE:$SHA" -f frontend/Dockerfile \
  --build-arg VITE_API_ROOT="${VITE_API_ROOT:-}" \
  frontend
docker tag "$IMAGE:$SHA" "$IMAGE:latest"

echo "Pushing images..."
docker push "$IMAGE:$SHA"
docker push "$IMAGE:latest"

echo "Done: pushed $IMAGE:$SHA and $IMAGE:latest"
