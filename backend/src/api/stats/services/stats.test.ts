import createService from "./stats";

// Mock the aggregation library so tests don't need a DB connection
jest.mock("../../../lib/aggregation/queries", () => ({
  aggregatePlayerStats: jest.fn().mockResolvedValue([]),
  aggregatePlayerRecords: jest.fn().mockResolvedValue([]),
  aggregateTeamStats: jest.fn().mockResolvedValue([]),
  aggregateTeamRecords: jest.fn().mockResolvedValue([]),
  aggregateCoachRecord: jest.fn().mockResolvedValue([]),
  aggregateRefereeStats: jest.fn().mockResolvedValue([]),
  listMainTeamPlayers: jest.fn().mockResolvedValue([]),
  listMainTeamCoaches: jest.fn().mockResolvedValue([]),
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
  listMainTeamPlayers,
  listMainTeamCoaches,
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
      const result = await service.findPlayersAllTimeStats("total", "all", "all", "all", "main");

      expect(aggregatePlayerStats).toHaveBeenCalledTimes(2);
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        stats: "total",
        location: "all",
        league: undefined,
        season: undefined,
        prev: false,
      });
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
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

      const data = await service.findPlayersRecords("main", "all", "all", "all", "points");

      expect(aggregatePlayerRecords).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
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

      const data = await service.findPlayersRecords("main", "all", "all", "all", null);
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

      const data = await service.findTeamRecords("main", "all", "all", "all", "games");

      expect(aggregateTeamRecords).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
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

      const data = await service.findTeamRecords("main", "all", "all", "all", null);
      expect(data[0].games).toBe(9);
    });
  });

  describe("findCoachesAllTimeStats", () => {
    test("normalizes role='all' to undefined", async () => {
      await service.findCoachesAllTimeStats("main", "all", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        role: undefined,
        location: "all",
        league: undefined,
        season: undefined,
        prev: false,
      });
    });

    test("passes specific role through", async () => {
      await service.findCoachesAllTimeStats("main", "head", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, expect.objectContaining({
        role: "head",
        prev: false,
      }));
    });

    test("runs current + prev in parallel and returns both", async () => {
      (aggregateCoachRecord as jest.Mock)
        .mockResolvedValueOnce([{ coach_id: "1" }])
        .mockResolvedValueOnce([{ coach_id: "2" }]);

      const result = await service.findCoachesAllTimeStats("main", "all", "all", "all", "all");

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

  describe("findPlayersCompareStats", () => {
    test("splits ids, forces database=main, and queries both players in parallel", async () => {
      (aggregatePlayerStats as jest.Mock)
        .mockResolvedValueOnce([{ player_id: "1", points: 10 }])
        .mockResolvedValueOnce([{ player_id: "2", points: 20 }]);

      const result = await service.findPlayersCompareStats("1,2", "total", "all", "all", "all");

      expect(aggregatePlayerStats).toHaveBeenCalledTimes(2);
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        stats: "total",
        location: "all",
        league: undefined,
        season: undefined,
        playerId: "1",
      });
      expect(aggregatePlayerStats).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        stats: "total",
        location: "all",
        league: undefined,
        season: undefined,
        playerId: "2",
      });
      expect(result).toEqual({
        player1: { player_id: "1", points: 10 },
        player2: { player_id: "2", points: 20 },
      });
    });

    test("returns null for a player with no matching rows", async () => {
      (aggregatePlayerStats as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ player_id: "2", points: 20 }]);

      const result = await service.findPlayersCompareStats("1,2", "average", "home", "aba", "2025");

      expect(result.player1).toBeNull();
      expect(result.player2).toEqual({ player_id: "2", points: 20 });
    });
  });

  describe("findPlayersRoster", () => {
    test("delegates to listMainTeamPlayers", async () => {
      (listMainTeamPlayers as jest.Mock).mockResolvedValue([
        { player_id: "1", first_name: "A", last_name: "B" },
      ]);

      const result = await service.findPlayersRoster();

      expect(listMainTeamPlayers).toHaveBeenCalledWith(fakeKnex);
      expect(result).toEqual([{ player_id: "1", first_name: "A", last_name: "B" }]);
    });
  });

  describe("findCoachesCompareStats", () => {
    test("splits ids, forces database=main, and queries both coaches in parallel", async () => {
      (aggregateCoachRecord as jest.Mock)
        .mockResolvedValueOnce([{ coach_id: "1", wins: 5 }])
        .mockResolvedValueOnce([{ coach_id: "2", wins: 8 }]);

      const result = await service.findCoachesCompareStats("1,2", "all", "all", "all");

      expect(aggregateCoachRecord).toHaveBeenCalledTimes(2);
      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        location: "all",
        league: undefined,
        season: undefined,
        coachId: "1",
      });
      expect(aggregateCoachRecord).toHaveBeenCalledWith(fakeKnex, {
        database: "main",
        location: "all",
        league: undefined,
        season: undefined,
        coachId: "2",
      });
      expect(result).toEqual({
        coach1: { coach_id: "1", wins: 5 },
        coach2: { coach_id: "2", wins: 8 },
      });
    });

    test("returns null for a coach with no matching rows", async () => {
      (aggregateCoachRecord as jest.Mock)
        .mockResolvedValueOnce([{ coach_id: "1", wins: 5 }])
        .mockResolvedValueOnce([]);

      const result = await service.findCoachesCompareStats("1,2", "away", "aba", "2025");

      expect(result.coach1).toEqual({ coach_id: "1", wins: 5 });
      expect(result.coach2).toBeNull();
    });
  });

  describe("findCoachesRoster", () => {
    test("delegates to listMainTeamCoaches", async () => {
      (listMainTeamCoaches as jest.Mock).mockResolvedValue([
        { coach_id: "1", first_name: "C", last_name: "D" },
      ]);

      const result = await service.findCoachesRoster();

      expect(listMainTeamCoaches).toHaveBeenCalledWith(fakeKnex);
      expect(result).toEqual([{ coach_id: "1", first_name: "C", last_name: "D" }]);
    });
  });
});
