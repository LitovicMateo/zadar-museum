<#
PowerShell helper to build and push the frontend Docker image to GHCR.
Usage:
  - Set environment variable GITHUB_PAT to a PAT with packages:write (or provide when prompted)
  - Run from repository root: .\scripts\push-frontend-to-ghcr.ps1
#>

param()

Set-StrictMode -Version Latest

$repoOwner = 'litovicmateo'
$image = "ghcr.io/$repoOwner/zadar-museum-frontend"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH"
    exit 1
}

# Determine git SHA
$sha = (git rev-parse --short HEAD) -replace "\s+",""
if (-not $sha) { $sha = "local" }

# Read PAT from env or prompt
$pat = $env:GITHUB_PAT
if (-not $pat) {
    Write-Host "Enter GitHub PAT (will not be echoed):"
    $pat = Read-Host -AsSecureString | ConvertFrom-SecureString
    Write-Error "Please set GITHUB_PAT as an environment variable before running in CI; this script expects a plain token in GITHUB_PAT"
    exit 1
}

Write-Host "Logging into ghcr.io..."
echo $pat | docker login ghcr.io -u $repoOwner --password-stdin

Write-Host "Building image $image:$sha and $image:latest"
docker build -t "$image:$sha" -f frontend/Dockerfile frontend
docker tag "$image:$sha" "$image:latest"

Write-Host "Pushing images..."
docker push "$image:$sha"
docker push "$image:latest"

Write-Host "Done. Pulled tags: $image:$sha and $image:latest"
