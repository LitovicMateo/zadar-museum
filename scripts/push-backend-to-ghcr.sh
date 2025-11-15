#!/usr/bin/env bash
#
# Build and push the backend Docker image to GHCR.
# Usage:
#   - Set environment variable GITHUB_PAT to a PAT with packages:write
#   - Run from repository root: ./scripts/push-backend-to-ghcr.sh
#

set -euo pipefail

REPO_OWNER="litovicmateo"
IMAGE="ghcr.io/$REPO_OWNER/zadar-museum-backend"

if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH"
    exit 1
fi

# Determine git SHA
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "local")

# Read PAT from env
if [ -z "${GITHUB_PAT:-}" ]; then
    echo "Error: Please set GITHUB_PAT environment variable with your GitHub Personal Access Token"
    exit 1
fi

echo "Logging into ghcr.io..."
echo "$GITHUB_PAT" | docker login ghcr.io -u "$REPO_OWNER" --password-stdin

echo "Building image $IMAGE:$SHA and $IMAGE:latest"
docker build -t "$IMAGE:$SHA" -f backend/Dockerfile backend
docker tag "$IMAGE:$SHA" "$IMAGE:latest"

echo "Pushing images..."
docker push "$IMAGE:$SHA"
docker push "$IMAGE:latest"

echo "Done. Pushed tags: $IMAGE:$SHA and $IMAGE:latest"
