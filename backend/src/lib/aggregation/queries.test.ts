import {
  aggregatePlayerStats,
  aggregatePlayerRecords,
  phaseClause,
} from "./queries";

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

describe("aggregatePlayerStats — team scoping", () => {
  function fakeKnex() {
    const calls: { sql: string; bindings: Record<string, unknown> }[] = [];
    const knex = {
      raw: jest.fn((sql: string, bindings: Record<string, unknown>) => {
        calls.push({ sql, bindings });
        return Promise.resolve({ rows: [] });
      }),
    } as unknown as import("knex").Knex;
    return { knex, calls };
  }

  it("filters by the given teamSlug instead of the main/non-main database split", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerStats(knex, {
      stats: "total",
      location: "all",
      teamSlug: "cibona",
    });
    const { sql, bindings } = calls[0];
    expect(sql).toContain("b.team_slug = :teamSlug");
    expect(sql).not.toContain("b.team_slug != :mainSlug");
    expect(sql).not.toContain("b.team_slug = :mainSlug");
    expect(bindings.teamSlug).toBe("cibona");
    // no opponent scoping -> keep reading the unified view (aggregate lines)
    expect(sql).toContain("FROM player_boxscore_unified b");
  });

  it("scopes to opponent games from the per-game view when opponentSlug is set", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerStats(knex, {
      stats: "average",
      location: "all",
      teamSlug: "zadar",
      opponentSlug: "cibona",
    });
    const { sql, bindings } = calls[0];
    expect(sql).toContain("b.team_slug = :teamSlug");
    expect(sql).toContain("b.opponent_team_slug = :opponentSlug");
    expect(bindings.teamSlug).toBe("zadar");
    expect(bindings.opponentSlug).toBe("cibona");
    // opponent scoping needs per-game rows (unified aggregate lines have no opponent)
    expect(sql).toContain("FROM (SELECT *, 1 AS games FROM player_boxscore) b");
    expect(sql).not.toContain("FROM player_boxscore_unified b");
  });
});

describe("aggregatePlayerRecords — team scoping", () => {
  function fakeKnex() {
    const calls: { sql: string; bindings: Record<string, unknown> }[] = [];
    const knex = {
      raw: jest.fn((sql: string, bindings: Record<string, unknown>) => {
        calls.push({ sql, bindings });
        return Promise.resolve({ rows: [] });
      }),
    } as unknown as import("knex").Knex;
    return { knex, calls };
  }

  it("filters by teamSlug and opponentSlug instead of the database split", async () => {
    const { knex, calls } = fakeKnex();
    await aggregatePlayerRecords(knex, {
      location: "all",
      teamSlug: "zadar",
      opponentSlug: "cibona",
    });
    const { sql, bindings } = calls[0];
    expect(sql).toContain("b.team_slug = :teamSlug");
    expect(sql).toContain("b.opponent_team_slug = :opponentSlug");
    expect(sql).not.toContain("b.team_slug = :mainSlug");
    expect(bindings.teamSlug).toBe("zadar");
    expect(bindings.opponentSlug).toBe("cibona");
  });
});
