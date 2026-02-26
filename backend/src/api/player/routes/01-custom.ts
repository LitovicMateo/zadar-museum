import { z } from "zod";
import { validate } from "../../../middlewares/validation";
import {
  playersBoxscoreQuerySchema,
  playerStatsParamsSchema,
  playerNumberParamsSchema,
  playerSeasonsParamsSchema,
  playerSeasonCompetitionsParamsSchema,
  playerIdParamsSchema,
  playerCareerHighParamsSchema,
  playerSeasonAverageParamsSchema,
  playerAllTimeStatsQuerySchema,
} from "../../../validation/schemas/player";
import { databaseSchema } from "../../../validation/schemas/common";

export default {
  routes: [
    {
      method: "GET",
      path: "/players/boxscore",
      handler: "player.findPlayersBoxscore",
      config: {
        auth: false,
        middlewares: [validate({ query: playersBoxscoreQuerySchema })],
      },
    },
    {
      method: "GET",
      path: "/players/stats/:db/all-time",
      handler: "player.findPlayersAllTimeStats",
      config: {
        auth: false,
        middlewares: [
          validate({
            params: z.object({ db: databaseSchema }),
            query: playerAllTimeStatsQuerySchema,
          }),
        ],
      },
    },
    {
      method: "GET",
      path: "/players/stats/:db/all-time/league",
      handler: "player.findPlayersAllTimeLeagueStats",
      config: {
        auth: false,
        middlewares: [
          validate({
            params: z.object({ db: databaseSchema }),
            query: playerAllTimeStatsQuerySchema,
          }),
        ],
      },
    },
    {
      method: "GET",
      path: "/players/player-number/:playerId",
      handler: "player.getMostFrequentPlayerNumber",
      config: {
        auth: false,
        middlewares: [validate({ params: playerNumberParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/players/seasons/:playerId/:database",
      handler: "player.getPlayerSeasons",
      config: {
        auth: false,
        middlewares: [validate({ params: playerSeasonsParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/players/competitions/:season/:playerId",
      handler: "player.getPlayerSeasonCompetitions",
      config: {
        auth: false,
        middlewares: [
          validate({ params: playerSeasonCompetitionsParamsSchema }),
        ],
      },
    },
    {
      method: "GET",
      path: "/players/teams/:playerId",
      handler: "player.getPlayerTeams",
      config: {
        auth: false,
        middlewares: [validate({ params: playerIdParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/career-high/:playerId",
      handler: "player.getCareerHighStats",
      config: {
        auth: false,
        middlewares: [validate({ params: playerCareerHighParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/:season/average/total/:playerId",
      handler: "player.getSeasonAverageStats",
      config: {
        auth: false,
        middlewares: [validate({ params: playerSeasonAverageParamsSchema })],
      },
    },
    {
      method: "GET",
      path: "/players/stats/:database/:season/average/league/:playerId",
      handler: "player.getSeasonAverageLeagueStats",
      config: {
        auth: false,
        middlewares: [validate({ params: playerSeasonAverageParamsSchema })],
      },
    },
  ],
};
