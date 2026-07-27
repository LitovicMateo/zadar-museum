import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { num } from '@/utils/ParseStatValue';

/**
 * Creates a game-less "aggregate line" — a season/tournament summary for historic
 * data with no per-game boxscores. Unlike createPlayerStats there is no game, no
 * duplicate check, and no per-game stat validation: whatever totals are known are
 * sent, everything blank is left NULL (never fabricated as 0). `league` holds the
 * selected competition's numeric id (see AggregateCompetition field).
 */

export const createAggregatePlayerStats = async (data: PlayerStatsFormData) => {
	const payload = {
		player: data.playerId,
		team: data.teamId,
		competition: data.league,
		season: data.season,
		status: 'no-data',
		gamesPlayed: num(data.gamesPlayed),
		points: num(data.points),
		fieldGoalsMade: num(data.fieldGoalsMade),
		fieldGoalsAttempted: num(data.fieldGoalsAttempted),
		threePointersMade: num(data.threePointersMade),
		threePointersAttempted: num(data.threePointersAttempted),
		freeThrowsMade: num(data.freeThrowsMade),
		freeThrowsAttempted: num(data.freeThrowsAttempted),
		rebounds: num(data.rebounds),
		offensiveRebounds: num(data.offensiveRebounds),
		defensiveRebounds: num(data.defensiveRebounds),
		assists: num(data.assists),
		steals: num(data.steals),
		blocks: num(data.blocks),
		turnovers: num(data.turnovers),
		fouls: num(data.fouls),
		foulsOn: num(data.foulsOn),
		blocksReceived: num(data.blocksReceived),
		plusMinus: num(data.plusMinus),
		efficiency: num(data.efficiency)
	};

	const res = await apiClient.post(API_ROUTES.create.playerStats(), { data: payload });
	return res;
};
