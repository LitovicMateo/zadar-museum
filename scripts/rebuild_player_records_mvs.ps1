# Rebuild materialized views under sql/Layer 2/player-records
# Usage: Run in PowerShell. Will exit on first error.

# Connection defaults (fall back to example .env values)
$dbHost = if ($env:DATABASE_HOST) { $env:DATABASE_HOST } else { "localhost" }
$dbPort = if ($env:DATABASE_PORT) { $env:DATABASE_PORT } else { "5432" }
$dbName = if ($env:DATABASE_NAME) { $env:DATABASE_NAME } else { "strapi" }
$dbUser = if ($env:DATABASE_USERNAME) { $env:DATABASE_USERNAME } else { "strapi" }
# Password: either PGPASSWORD env var or fallback to DATABASE_PASSWORD or example
if (-not $env:PGPASSWORD) {
    if ($env:DATABASE_PASSWORD) {
        $env:PGPASSWORD = $env:DATABASE_PASSWORD
    } else {
        $env:PGPASSWORD = "strapi_password_change_me"
    }
}

Write-Host "Using connection: host=$dbHost port=$dbPort db=$dbName user=$dbUser"

# Optionally load repository .env file (if present) to populate connection vars.
# Set environment variable SKIP_REPO_ENV=1 to prevent loading repo .env (useful when preferring backend/.env creds).
$repoEnv = Join-Path $PSScriptRoot "..\.env"
if ($env:SKIP_REPO_ENV) {
    Write-Host "Skipping loading repo .env because SKIP_REPO_ENV is set."
} else {
    if (Test-Path $repoEnv) {
        Write-Host "Loading env file: $repoEnv"
        Get-Content -Path $repoEnv | ForEach-Object {
            $line = $_.Trim()
            if ($line -eq "" -or $line.StartsWith("#")) { return }
            if ($line -match "^([^=]+)=(.*)$") {
                $k = $matches[1].Trim()
                $v = $matches[2].Trim()
                if ($v -match '^"(.*)"$') { $v = $matches[1] }
                Set-Item -Path "Env:\$k" -Value $v -ErrorAction SilentlyContinue
            }
        }
        # Refresh local variables after loading .env
        $dbHost = if ($env:DATABASE_HOST) { $env:DATABASE_HOST } else { $dbHost }
        $dbPort = if ($env:DATABASE_PORT) { $env:DATABASE_PORT } else { $dbPort }
        $dbName = if ($env:DATABASE_NAME) { $env:DATABASE_NAME } else { $dbName }
        $dbUser = if ($env:DATABASE_USERNAME) { $env:DATABASE_USERNAME } else { $dbUser }
        if (-not $env:PGPASSWORD -and $env:DATABASE_PASSWORD) { $env:PGPASSWORD = $env:DATABASE_PASSWORD }
        Write-Host "After loading .env -> host=$dbHost port=$dbPort db=$dbName user=$dbUser"
    } else {
        Write-Host "No repo .env found at $repoEnv"
    }
}

# If the configured host doesn't resolve from this machine, fall back to localhost
try {
    [void][System.Net.Dns]::GetHostAddresses($dbHost)
    Write-Host "Resolved DB host: $dbHost"
} catch {
    Write-Host "Unable to resolve DB host '$dbHost' from this machine; falling back to 'localhost' for connection (credentials still from .env)."
    $dbHost = 'localhost'
}

$basePath = Join-Path $PSScriptRoot "..\sql\Layer 2\player-records"
$basePath = (Resolve-Path $basePath).Path
Write-Host "Searching SQL files in: $basePath"

$files = Get-ChildItem -Path $basePath -Recurse -Filter '*.sql' | Sort-Object FullName
if ($files.Count -eq 0) {
    Write-Error "No SQL files found under $basePath"
    exit 1
}

foreach ($f in $files) {
    Write-Host "`n--- Processing $($f.FullName) ---"
    $content = Get-Content -Path $f.FullName -Raw
    # Try to find materialized view name
    $mvName = $null
    if ($content -match "CREATE\s+MATERIALIZED\s+VIEW\s+(?:public\.)?([a-zA-Z0-9_]+)") {
        $mvName = $matches[1]
        Write-Host "Found materialized view: $mvName"
        $dropCmd = "DROP MATERIALIZED VIEW IF EXISTS public.$mvName CASCADE;"
        Write-Host "Dropping if exists: public.$mvName"
        psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -c "$dropCmd"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to drop materialized view public.$mvName"
            exit $LASTEXITCODE
        }
    } else {
        Write-Host "No CREATE MATERIALIZED VIEW found in header; will execute file anyway."
    }

    Write-Host "Applying SQL file: $($f.FullName)"
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f $f.FullName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "psql error applying $($f.FullName)"
        exit $LASTEXITCODE
    }
    Write-Host "Success: $($f.FullName)"
}

Write-Host "`nAll files executed successfully."