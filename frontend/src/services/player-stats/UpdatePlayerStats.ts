import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { num } from '@/utils/ParseStatValue';
import { validateStats } from '@/utils/ValidateStats';

export const updatePlayerStats = async ({ id, ...data }: { id: string } & PlayerStatsFormData) => {
	// Validate player stats using shared validator
	validateStats(data, { checkPlayer: true });

	const res = await apiClient.put(API_ROUTES.edit.playerStats(id), {
		data: {
			game: data.gameId,
			team: data.teamId,
			player: data.playerId,
			status: data.status,
			isCaptain: data.isCaptain,
			playerNumber: data.playerNumber,
			minutes: num(data.minutes),
			seconds: num(data.seconds),
			points: num(data.points),
			fieldGoalsMade: num(data.fieldGoalsMade),
			fieldGoalsAttempted: num(data.fieldGoalsAttempted),
			threePointersMade: num(data.threePointersMade),
			threePointersAttempted: num(data.threePointersAttempted),
			freeThrowsMade: num(data.freeThrowsMade),
			freeThrowsAttempted: num(data.freeThrowsAttempted),
			rebounds: data.rebounds
				? +data.rebounds
				: data.offensiveRebounds || data.defensiveRebounds
					? (num(data.offensiveRebounds) ?? 0) + (num(data.defensiveRebounds) ?? 0)
					: null,
			offensiveRebounds: data.rebounds ? null : num(data.offensiveRebounds),
			defensiveRebounds: data.rebounds ? null : num(data.defensiveRebounds),
			assists: num(data.assists),
			steals: num(data.steals),
			blocks: num(data.blocks),
			turnovers: num(data.turnovers),
			fouls: num(data.fouls),
			foulsOn: num(data.foulsOn),
			blocksReceived: num(data.blocksReceived),
			efficiency: num(data.efficiency),
			plusMinus: num(data.plusMinus)
		}
	});

	return res;
};
