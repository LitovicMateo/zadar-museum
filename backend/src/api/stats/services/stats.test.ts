import createService from "./stats";

// Mock the aggregation library so tests don't need a DB connection
jest.mock("../../../lib/aggregation/queries", () => ({
  aggregatePlayerStats: jest.fn().mockResolvedValue([]),
  aggregatePlayerRecords: jest.fn().mockResolvedValue([]),
  aggregateTeamStats: jest.fn().mockResolvedValue([]),
  aggregateTeamRecords: jest.fn().mockResolvedValue([]),
  aggregateCoachRecord: jest.fn().mockResolvedValue([]),
  aggregateRefereeStats: jest.fn().mockResolvedValue([]),
}));

jest.mock("../../../lib/mainTeam", () => ({
  getMainTeamSlug: jest.fn().mockResolvedValue("kk-zadar"),
}));

import {
  aggregatePlayerStats,
  aggregatePlayerRecords,
  aggregateTeamStats,
  aggregateTeamRecords,
  aggregateCoachRecord,
  aggregateRefereeStats,
} from "../../../lib/aggregation/queries";

const fakeKnex = {} as any;

describe("stats service", () => {
  let service: ReturnType<typeof createService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = createService({ strapi: { db: { connection: fakeKnex } } } as any);
  });

  describe("findPlayersAllTimeStats", () => {
    test("passes normalized params and runs current + prev in parallel", async () => {
      const result = await service.findPlayersAllTimeStats("total", "all", "all", "all", "zadar");

      expect(aggregatePlayerStats).toHaveBeenCalledTimes(2);
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "zadar",
        stats: "total",
        location: "all",
        league: undefined,
        season: undefined,
        prev: false,
      });
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "zadar",
        stats: "total",
        location: "all",
        league: undefined,
        season: undefined,
        prev: true,
      });
      expect(result).toHaveProperty("current");
      expect(result).toHaveProperty("previous");
    });

    test("normalizes location='all' and passes specific league/season", async () => {
      await service.findPlayersAllTimeStats("average", "home", "aba", "2025", "opponent");

      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "opponent",
        stats: "average",
        location: "home",
        league: "aba",
        season: "2025",
        prev: false,
      });
    });
  });

  describe("findPlayersRecords", () => {
    test("calls aggregatePlayerRecords and sorts by sortKey", async () => {
      (aggregatePlayerRecords as jest.Mock).mockResolvedValue([
        { points: 10 },
        { points: 30 },
        { points: 20 },
      ]);

      const data = await service.findPlayersRecords("zadar", "all", "all", "all", "points");

      expect(aggregatePlayerRecords).toHaveBeenCalledWith(fakeKnex, {
        database: "zadar",
        location: "all",
        league: undefined,
        season: undefined,
      });
      expect(data[0].points).toBe(30);
      expect(data[1].points).toBe(20);
      expect(data[2].points).toBe(10);
    });

    test("defaults sortKey to 'points' when not provided", async () => {
      (aggregatePlayerRecords as jest.Mock).mockResolvedValue([
        { points: 5 },
        { points: 15 },
      ]);

      const data = await service.findPlayersRecords("zadar", "all", "all", "all", null);
      expect(data[0].points).toBe(15);
    });
  });

  describe("findTeamsAllTimeStats", () => {
    test("filters out main team from results", async () => {
      (aggregateTeamStats as jest.Mock).mockResolvedValue([
        { team_slug: "kk-zadar", games: 10 },
        { team_slug: "cibona", games: 8 },
      ]);

      const data = await service.findTeamsAllTimeStats("all", "all", "all");

      expect(aggregateTeamStats).toHaveBeenCalledWith(fakeKnex, {
        location: "all",
        league: undefined,
        season: undefined,
        excludeMainTeam: true,
      });
      expect(data).toHaveLength(1);
      expect(data[0].team_slug).toBe("cibona");
    });
  });

  describe("findTeamRecords", () => {
    test("calls aggregateTeamRecords and sorts by sortKey", async () => {
      (aggregateTeamRecords as jest.Mock).mockResolvedValue([
        { games: 5, score: 80 },
        { games: 15, score: 90 },
      ]);

      const data = await service.findTeamRecords("zadar", "all", "all", "all", "games");

      expect(aggregateTeamRecords).toHaveBeenCalledWith(fakeKnex, {
        database: "zadar",
        location: "all",
        league: undefined,
        season: undefined,
      });
      expect(data[0].games).toBe(15);
    });

    test("defaults sortKey to 'games' when not provided", async () => {
      (aggregateTeamRecords as jest.Mock).mockResolvedValue([
        { games: 3 },
        { games: 9 },
      ]);

      const data = await service.findTeamRecords("zadar", "all", "all", "all", null);
      expect(data[0].games).toBe(9);
    });
  });

  describe("findCoachesAllTimeStats", () => {
    test("normalizes role='all' to undefined", async () => {
      await service.findCoachesAllTimeStats("zadar", "all", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, {
        database: "zadar",
        role: undefined,
        location: "all",
        league: undefined,
        season: undefined,
        prev: false,
      });
    });

    test("passes specific role through", async () => {
      await service.findCoachesAllTimeStats("zadar", "head", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, expect.objectContaining({
        role: "head",
        prev: false,
      }));
    });

    test("runs current + prev in parallel and returns both", async () => {
      (aggregateCoachRecord as jest.Mock)
        .mockResolvedValueOnce([{ coach_id: "1" }])
        .mockResolvedValueOnce([{ coach_id: "2" }]);

      const result = await service.findCoachesAllTimeStats("zadar", "all", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledTimes(2);
      expect(result.current).toEqual([{ coach_id: "1" }]);
      expect(result.previous).toEqual([{ coach_id: "2" }]);
    });
  });

  describe("findRefereesAllTimeStats", () => {
    test("delegates to aggregateRefereeStats with normalized params", async () => {
      await service.findRefereesAllTimeStats("home", "aba", "2024");

      expect(aggregateRefereeStats).toHaveBeenCalledWith(fakeKnex, {
        location: "home",
        league: "aba",
        season: "2024",
      });
    });
  });
});
