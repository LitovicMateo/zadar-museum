$files = @(
    'sql/Layer 2/referee/all_time/referee_league_stats.sql',
    'sql/Layer 2/referee/all_time/referee_league_stats_away.sql',
    'sql/Layer 2/referee/all_time/referee_league_stats_home.sql',
    'sql/Layer 2/referee/all_time/referee_stats.sql',
    'sql/Layer 2/referee/all_time/referee_stats_away.sql',
    'sql/Layer 2/referee/all_time/referee_stats_home.sql',
    'sql/Layer 2/referee/season/referee_season_league_stats.sql',
    'sql/Layer 2/referee/season/referee_season_league_stats_away.sql',
    'sql/Layer 2/referee/season/referee_season_league_stats_home.sql',
    'sql/Layer 2/referee/season/referee_season_stats.sql',
    'sql/Layer 2/referee/season/referee_season_stats_away.sql',
    'sql/Layer 2/referee/season/referee_season_stats_home.sql'
)

$backupDir = 'sql/Layer 2/referee.broken.backup'
if (Test-Path $backupDir) {
    Write-Output "Backup folder $backupDir already exists; overwriting"
    Remove-Item -Recurse -Force $backupDir
}
Copy-Item -Recurse -Path 'sql/Layer 2/referee' -Destination $backupDir -Force

$commit = '791fa187f71e2c9e9026865fd41be57c2d809d96'
foreach ($f in $files) {
    Write-Output "Restoring $f from $commit"
    & git checkout $commit -- $f
}
Write-Output 'Restore complete.'
