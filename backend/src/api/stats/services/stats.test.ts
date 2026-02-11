import createService from "./stats";

function makeFakeKnex(calls: string[]) {
  const q = {
    _table: undefined as any,
    select() {
      return this;
    },
    orderBy() {
      return this; // chainable
    },
    where(_col: string, _opOrVal: any, _val?: any) {
      // normalize args: where(col, val) or where(col, op, val)
      const value = _val === undefined ? _opOrVal : _val;
      // record where calls on the factory instance
      (knex as any)._whereCalls.push({ column: _col, value });
      return this;
    },
    // make the chain awaitable
    then(onFulfilled: any, onRejected: any) {
      return Promise.resolve([]).then(onFulfilled, onRejected);
    },
  } as any;

  const knex = (table: string) => {
    calls.push(table);
    const clone = Object.create(q);
    clone._table = table;
    return clone;
  };

  // attach array to record where calls for assertions
  (knex as any)._whereCalls = [] as Array<{ column: string; value: unknown }>;

  return knex as unknown as any;
}

describe("stats service - table composition", () => {
  test("uses non-season table when season='all' and league='all'", async () => {
    const calls: string[] = [];
    const fakeKnex = makeFakeKnex(calls);
    const service = createService({ strapi: { db: { connection: fakeKnex } } } as any);

    await service.findPlayersAllTimeStats("total", "all", "all", "all", "zadar");

    // first call is current table, second is prev table
    expect(calls[0]).toBe("zadar_player_total_all_time");
    expect(calls[1]).toBe("zadar_player_total_all_time_prev");
  });

  test("uses season-specific table when season is a year (league='all')", async () => {
    const calls: string[] = [];
    const fakeKnex = makeFakeKnex(calls);
    const service = createService({ strapi: { db: { connection: fakeKnex } } } as any);

    await service.findPlayersAllTimeStats("total", "home", "all", "2025", "zadar");

    expect(calls[0]).toBe("zadar_player_season_total_all_time_home");
    expect(calls[1]).toBe("zadar_player_season_total_all_time_home_prev");
  });

  test("includes location suffix when location is specific (away/home) and league='all'", async () => {
    const calls: string[] = [];
    const fakeKnex = makeFakeKnex(calls);
    const service = createService({ strapi: { db: { connection: fakeKnex } } } as any);

    await service.findPlayersAllTimeStats("total", "away", "all", "all", "zadar");

    expect(calls[0]).toBe("zadar_player_total_all_time_away");
  });

  test("includes league suffix when league is specific", async () => {
    const calls: string[] = [];
    const fakeKnex = makeFakeKnex(calls) as any;
    const service = createService({ strapi: { db: { connection: fakeKnex } } } as any);

    await service.findPlayersAllTimeStats("total", "all", "aba", "all", "zadar");

    expect(calls[0]).toBe("zadar_player_total_all_time_league");
    expect(calls[1]).toBe("zadar_player_total_all_time_league_prev");
    // when league is specific, a WHERE for league_slug should be added
    expect(fakeKnex._whereCalls).toEqual(
      expect.arrayContaining([{ column: "league_slug", value: "aba" }]),
    );

    // league + location
    calls.length = 0;
    fakeKnex._whereCalls.length = 0;
    await service.findPlayersAllTimeStats("total", "away", "aba", "all", "zadar");
    expect(calls[0]).toBe("zadar_player_total_all_time_league_away");
    expect(fakeKnex._whereCalls).toEqual(
      expect.arrayContaining([{ column: "league_slug", value: "aba" }]),
    );
  });

  test("does not add league/season WHERE when league='all' and season='all'", async () => {
    const calls: string[] = [];
    const fakeKnex = makeFakeKnex(calls) as any;
    const service = createService({ strapi: { db: { connection: fakeKnex } } } as any);

    await service.findPlayersAllTimeStats("total", "all", "all", "all", "zadar");

    expect(calls[0]).toBe("zadar_player_total_all_time");
    // no WHERE clauses for league/season should be added
    expect(fakeKnex._whereCalls).not.toEqual(
      expect.arrayContaining([{ column: "league_slug", value: expect.anything() }]),
    );
    expect(fakeKnex._whereCalls).not.toEqual(
      expect.arrayContaining([{ column: "season", value: expect.anything() }]),
    );
  });
});
