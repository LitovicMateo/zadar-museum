#!/usr/bin/env node
/*
 * Refresh all team-related materialized views.
 * This script drops and recreates all team stats materialized views in the correct order.
 *
 * Usage:
 *   node ./backend/scripts/refresh-team-views.js
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Define team-related SQL files in dependency order
const teamSqlFiles = [
  // Layer 2 - All Time
  "sql/Layer 2/team/all_time/team_average_stats.sql",
  "sql/Layer 2/team/all_time/team_average_stats_home.sql",
  "sql/Layer 2/team/all_time/team_average_stats_away.sql",
  "sql/Layer 2/team/all_time/team_league_average_stats.sql",
  "sql/Layer 2/team/all_time/team_league_average_stats_home.sql",
  "sql/Layer 2/team/all_time/team_league_average_stats_away.sql",

  // Layer 2 - Season
  "sql/Layer 2/team/season/team_season_average_stats.sql",
  "sql/Layer 2/team/season/team_season_average_stats_home.sql",
  "sql/Layer 2/team/season/team_season_average_stats_away.sql",
  "sql/Layer 2/team/season/team_season_league_average_stats.sql",
  "sql/Layer 2/team/season/team_season_league_average_stats_home.sql",
  "sql/Layer 2/team/season/team_season_league_average_stats_away.sql",

  // Layer 3 - Full aggregations
  "sql/Layer 3/team/team_average_stats_full.sql",
  "sql/Layer 3/team/team_league_average_stats_full.sql",
  "sql/Layer 3/team/team_season_average_stats_full.sql",
  "sql/Layer 3/team/team_season_league_average_stats_full.sql",
];

// Extract materialized view name from SQL
function extractMatviewName(sql) {
  const re =
    /CREATE\s+MATERIALIZED\s+VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?([\w]+)"?\.)?"?([\w\.]+)"?/i;
  const m = sql.match(re);
  if (!m) return null;
  const name = m[2] || m[1];
  return name.includes(".") ? name.split(".").pop() : name;
}

async function main() {
  const repoRoot = path.resolve(__dirname, "../..");

  console.log("=== Team Materialized Views Refresh Script ===\n");

  // Build connection string
  const connectionString =
    process.env.DATABASE_URL ||
    (() => {
      const host =
        process.env.DATABASE_HOST || process.env.DB_HOST || "localhost";
      const port = process.env.DATABASE_PORT || process.env.DB_PORT || "5432";
      const user =
        process.env.DATABASE_USERNAME ||
        process.env.DB_USER ||
        process.env.PGUSER ||
        "postgres";
      const pass =
        process.env.DATABASE_PASSWORD ||
        process.env.DB_PASS ||
        process.env.PGPASSWORD ||
        "";
      const db =
        process.env.DATABASE_NAME ||
        process.env.DB_NAME ||
        process.env.PGDATABASE ||
        "postgres";
      if (!user) return null;
      const auth = pass
        ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
        : `${encodeURIComponent(user)}@`;
      return `postgresql://${auth}${host}:${port}/${db}`;
    })();

  if (!connectionString) {
    console.error(
      "No database connection information found. Set DATABASE_URL or DB_* env vars."
    );
    process.exit(2);
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log(`Processing ${teamSqlFiles.length} team SQL files...\n`);

    for (const relPath of teamSqlFiles) {
      const fullPath = path.join(repoRoot, relPath);

      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${relPath}`);
        continue;
      }

      console.log(`📄 Processing: ${relPath}`);
      const sql = fs.readFileSync(fullPath, "utf8").trim();

      if (!sql) {
        console.log("   Empty file, skipping\n");
        continue;
      }

      const matviewName = extractMatviewName(sql);

      if (!matviewName) {
        console.log("   ⚠️  Could not detect view name, skipping\n");
        continue;
      }

      // Drop the materialized view if it exists
      try {
        await client.query(
          `DROP MATERIALIZED VIEW IF EXISTS "${matviewName}" CASCADE;`
        );
        console.log(`   🗑️  Dropped existing view: ${matviewName}`);
      } catch (dropErr) {
        console.log(`   ⚠️  Could not drop ${matviewName}: ${dropErr.message}`);
      }

      // Create the materialized view
      try {
        await client.query(sql);
        console.log(`   ✅ Created view: ${matviewName}\n`);
      } catch (createErr) {
        console.error(`   ❌ Error creating ${matviewName}:`);
        console.error(`      ${createErr.message}\n`);
        throw createErr;
      }
    }

    console.log("🎉 All team materialized views refreshed successfully!");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("\n❌ Script failed:", err.message);
  process.exit(1);
});
