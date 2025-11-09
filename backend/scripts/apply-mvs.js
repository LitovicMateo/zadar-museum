#!/usr/bin/env node
/*
 * Apply materialized view SQL files from a directory in order.
 * - Defaults to using the `sql` directory at the repo root (../../sql from backend/scripts)
 * - Uses DATABASE_URL env or DB_* env vars for connection
 * - For each .sql file, attempts to detect the materialized view name and skips creation
 *   if the matview already exists. This avoids failing on already-applied files.
 *
 * Usage:
 *   node ./backend/scripts/apply-mvs.js [path/to/sql/dir]
 * or set env SQL_DIR and run the script.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const defaultSqlDir =
  process.env.SQL_DIR || path.resolve(__dirname, "../../sql");
const sqlDir = process.argv[2] || defaultSqlDir;

function collectSqlFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  // sort for deterministic order
  items.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true })
  );
  let files = [];
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      files = files.concat(collectSqlFiles(full));
    } else if (it.isFile() && it.name.toLowerCase().endsWith(".sql")) {
      files.push(full);
    }
  }
  return files;
}

function extractMatviewName(sql) {
  // crude regex to capture the matview name after CREATE MATERIALIZED VIEW [IF NOT EXISTS] [schema.]name
  const re =
    /CREATE\s+MATERIALIZED\s+VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?([\w]+)"?\.)?"?([\w\.]+)"?/i;
  const m = sql.match(re);
  if (!m) return null;
  // name may be in capture 2, if schema provided capture 1 is schema
  const name = m[2] || m[1];
  // strip possible schema prefix
  return name.includes(".") ? name.split(".").pop() : name;
}

async function main() {
  if (!fs.existsSync(sqlDir)) {
    console.error("SQL directory not found:", sqlDir);
    process.exit(2);
  }

  console.log("Collecting .sql files from", sqlDir);
  const files = collectSqlFiles(sqlDir);
  console.log(`Found ${files.length} .sql files`);

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
    // Process files in passes to handle dependencies between materialized views.
    // If a file fails due to missing relation (42P01), we skip it and retry in the next pass.
    let pending = files.slice();
    const maxPasses = Math.max(5, pending.length);
    let pass = 0;
    while (pending.length > 0 && pass < maxPasses) {
      pass += 1;
      console.log(`\n=== Pass ${pass} - ${pending.length} files pending ===`);
      const nextPending = [];
      let appliedThisPass = 0;

      for (const f of pending) {
        console.log("---");
        console.log("Processing", path.relative(process.cwd(), f));
        const sql = fs.readFileSync(f, "utf8").trim();
        if (!sql) {
          console.log("Empty file, skipping");
          continue;
        }

        const matviewName = extractMatviewName(sql);
        if (matviewName) {
          // check existence
          const existsRes = await client.query(
            `SELECT 1 FROM pg_matviews WHERE schemaname = 'public' AND matviewname = $1 LIMIT 1`,
            [matviewName]
          );
          if (existsRes.rowCount > 0) {
            console.log(
              `Materialized view '${matviewName}' already exists — skipping creation.`
            );
            continue;
          }
        } else {
          console.log(
            "Could not detect materialized view name; running SQL as-is (file may contain development operations)."
          );
        }

        try {
          await client.query(sql);
          console.log("Applied", path.basename(f));
          appliedThisPass += 1;
        } catch (err) {
          if (
            err &&
            (err.code === "42P01" ||
              /relation .* does not exist/i.test(err.message))
          ) {
            console.log(
              `Defers ${path.basename(f)} due to missing relation: ${err.message}`
            );
            nextPending.push(f);
            continue;
          }
          console.error("Error applying", path.basename(f), err.message);
          throw err;
        }
      }

      if (appliedThisPass === 0 && nextPending.length > 0) {
        console.error(
          "No files applied in this pass and there are still pending files. Likely circular or missing dependencies."
        );
        console.error(
          "Pending example:",
          nextPending.slice(0, 5).map((p) => path.relative(process.cwd(), p))
        );
        throw new Error(
          "Could not resolve dependencies between SQL files; aborting."
        );
      }

      pending = nextPending;
    }

    if (pending.length > 0) {
      throw new Error(
        `Failed to apply all files after ${pass} passes. ${pending.length} files remain.`
      );
    }

    console.log("\nAll files processed.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Runner failed:", err);
  process.exit(1);
});
