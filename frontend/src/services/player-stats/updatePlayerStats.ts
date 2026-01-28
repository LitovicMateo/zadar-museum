import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { PlayerStatsFormData } from '@/schemas/player-stats';
import { validateStats } from '@/utils/validateStats';

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
			minutes: +data.minutes,
			seconds: +data.seconds,
			points: +data.points,
			fieldGoalsMade: +data.fieldGoalsMade,
			fieldGoalsAttempted: +data.fieldGoalsAttempted,
			threePointersMade: +data.threePointersMade,
			threePointersAttempted: +data.threePointersAttempted,
			freeThrowsMade: +data.freeThrowsMade,
			freeThrowsAttempted: +data.freeThrowsAttempted,
			rebounds: data.rebounds ? +data.rebounds : +data.offensiveRebounds + +data.defensiveRebounds,
			offensiveRebounds: data.rebounds ? undefined : +data.offensiveRebounds,
			defensiveRebounds: data.rebounds ? undefined : +data.defensiveRebounds,
			assists: data.assists ? +data.assists : undefined,
			steals: data.steals ? +data.steals : undefined,
			blocks: data.blocks ? +data.blocks : undefined,
			turnovers: data.turnovers ? +data.turnovers : undefined,
			fouls: data.fouls ? +data.fouls : undefined,
			foulsOn: data.foulsOn ? +data.foulsOn : undefined,
			efficiency: data.efficiency ? +data.efficiency : undefined,
			plusMinus: data.plusMinus ? +data.plusMinus : undefined
		}
	});

	return res;
};
