import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';

/**
 * Updates a game-less aggregate line. Mirrors createAggregatePlayerStats: no game,
 * no per-game validation, blanks saved as NULL. `league` holds the competition id.
 */
const num = (v?: string) => (v && v.trim() !== '' ? +v : undefined);

export const updateAggregatePlayerStats = async ({
	id,
	...data
}: { id: string } & PlayerStatsFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.playerStats(id), {
		data: {
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
		}
	});

	return res;
};
