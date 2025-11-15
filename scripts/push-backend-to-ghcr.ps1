<#
PowerShell helper to build and push the backend Docker image to GHCR.
Usage:
  - Set environment variable GITHUB_PAT to a PAT with packages:write
  - Run from repository root: .\scripts\push-backend-to-ghcr.ps1
#>

param()

Set-StrictMode -Version Latest

$repoOwner = 'litovicmateo'
$image = "ghcr.io/$repoOwner/zadar-museum-backend"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH"
    exit 1
}

# Determine git SHA
$sha = (git rev-parse --short HEAD) -replace "\s+",""
if (-not $sha) { $sha = "local" }

# Read PAT from env
$pat = $env:GITHUB_PAT
if (-not $pat) {
    Write-Error "Please set GITHUB_PAT environment variable with your GitHub Personal Access Token"
    exit 1
}

Write-Host "Logging into ghcr.io..."
Write-Output $pat | docker login ghcr.io -u $repoOwner --password-stdin

Write-Host "Building image ${image}:$sha and ${image}:latest"
docker build -t "${image}:$sha" -f backend/Dockerfile backend
docker tag "${image}:$sha" "${image}:latest"

Write-Host "Pushing images..."
docker push "${image}:$sha"
docker push "${image}:latest"

Write-Host "Done. Pushed tags: ${image}:$sha and ${image}:latest"
