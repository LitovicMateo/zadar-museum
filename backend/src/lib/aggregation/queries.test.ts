import { aggregatePlayerStats, phaseClause } from "./queries";

jest.mock("../mainTeam", () => ({
  getMainTeamSlug: jest.fn().mockResolvedValue("zadar"),
}));

describe("phaseClause", () => {
  it("returns null for 'all' or undefined (no filter, backward compatible)", () => {
    expect(phaseClause("b.game_stage", "all")).toBeNull();
    expect(phaseClause("b.game_stage", undefined)).toBeNull();
  });

  it("filters regular season as league + group stages", () => {
    expect(phaseClause("b.game_stage", "regular")).toBe(
      "b.game_stage IN ('league', 'group')",
    );
  });

  it("filters playoff as the playoff stage only", () => {
    expect(phaseClause("tb.stage", "playoff")).toBe("tb.stage = 'playoff'");
  });

  it("uses the supplied column name verbatim", () => {
    expect(phaseClause("s.stage", "regular")).toBe(
      "s.stage IN ('league', 'group')",
    );
  });
});

describe("aggregatePlayerStats — aggregate-line support", () => {
  function fakeKnex() {
    const calls: { sql: string; bindings: unknown }[] = [];
    const knex = {
      raw: jest.fn((sql: string, bindings: unknown) => {
        calls.push({ sql, bindings });
        return Promise.resolve({ rows: [] });
      }),
    } as unknown as import("knex").Knex;
    return { knex, calls };
  }

  it("reads from the unified view so game-less aggregate lines are included", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerStats(knex, {
      database: "main",
      stats: "total",
      location: "all",
    });
    expect(calls[0].sql).toContain("FROM player_boxscore_unified b");
  });

  it("counts games as SUM(b.games), not COUNT(game_id), so summary rows weigh N games", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerStats(knex, {
      database: "main",
      stats: "total",
      location: "all",
    });
    expect(calls[0].sql).toContain("SUM(b.games) AS games");
    expect(calls[0].sql).not.toContain("COUNT(b.game_id)");
  });

  it("computes per-game averages as SUM(col) / SUM(games), not AVG(col)", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerStats(knex, {
      database: "main",
      stats: "average",
      location: "all",
    });
    const sql = calls[0].sql;
    // weighted average that folds in aggregate lines correctly and stays
    // identical to AVG(col) for pure per-game data (each row has games = 1)
    expect(sql).toContain("SUM(b.points)::numeric / NULLIF(SUM(b.games), 0)");
    expect(sql).not.toMatch(/AVG\(b\.points\)/);
    expect(sql).not.toMatch(/AVG\(b\.rebounds\)/);
  });
});
