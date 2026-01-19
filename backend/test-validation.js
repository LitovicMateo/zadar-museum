/**
 * Simple script to test validation endpoints
 * Run this after starting the backend server
 */

const http = require("http");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function makeRequest(path, expectedStatus) {
  return new Promise((resolve) => {
    const options = {
      hostname: "localhost",
      port: 1337,
      path,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const passed = res.statusCode === expectedStatus;
        const statusColor = passed ? colors.green : colors.red;

        console.log(`${passed ? "✓" : "✗"} ${path}`);
        console.log(
          `  Expected: ${expectedStatus}, Got: ${statusColor}${res.statusCode}${colors.reset}`,
        );

        if (res.statusCode === 400 && data) {
          try {
            const error = JSON.parse(data);
            console.log(
              `  ${colors.yellow}Error: ${error.error?.message}${colors.reset}`,
            );
            if (error.error?.details?.errors) {
              error.error.details.errors.forEach((err) => {
                console.log(`    - ${err.path.join(".")}: ${err.message}`);
              });
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
        console.log("");

        resolve(passed);
      });
    });

    req.on("error", (e) => {
      console.error(
        `${colors.red}✗ Request failed: ${e.message}${colors.reset}\n`,
      );
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log(
    `\n${colors.blue}=== Testing Validation Middleware ===${colors.reset}\n`,
  );

  const tests = [
    // Stats API - Valid requests
    {
      name: "Valid player all-time stats",
      path: "/api/stats/player/all-time?database=zadar&stats=total",
      expectedStatus: 200,
    },
    {
      name: "Valid team game stats",
      path: "/api/stats/team/game?database=zadar&season=2024",
      expectedStatus: 200,
    },

    // Stats API - Invalid requests
    {
      name: "Invalid database parameter",
      path: "/api/stats/player/all-time?database=invalid_db&stats=total",
      expectedStatus: 400,
    },
    {
      name: "Invalid stats parameter",
      path: "/api/stats/player/all-time?database=zadar&stats=invalid",
      expectedStatus: 400,
    },
    {
      name: "Invalid season format",
      path: "/api/stats/player/all-time?database=zadar&stats=total&season=20244",
      expectedStatus: 400,
    },
    {
      name: "Season out of range",
      path: "/api/stats/player/all-time?database=zadar&stats=total&season=1800",
      expectedStatus: 400,
    },

    // Player API - Invalid requests
    {
      name: "Invalid player stats database",
      path: "/api/player/stats/invalid_db/1",
      expectedStatus: 400,
    },
    {
      name: "Invalid player number (negative)",
      path: "/api/player/number/zadar/-1",
      expectedStatus: 400,
    },
    {
      name: "Invalid player number (string)",
      path: "/api/player/number/zadar/abc",
      expectedStatus: 400,
    },

    // Team API - Invalid requests
    {
      name: "Invalid team slug (too long)",
      path: "/api/team/" + "a".repeat(51),
      expectedStatus: 400,
    },
    {
      name: "Invalid team slug (uppercase)",
      path: "/api/team/INVALID-TEAM",
      expectedStatus: 400,
    },

    // Coach API - Invalid requests
    {
      name: "Invalid coach ID (not a number)",
      path: "/api/coach/abc",
      expectedStatus: 400,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await makeRequest(test.path, test.expectedStatus);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`${colors.blue}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

// Wait a bit for server to be ready
setTimeout(runTests, 1000);
