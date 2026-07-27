import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { PlayerStatsFormData } from '@/schemas/PlayerStats';
import { num } from '@/utils/ParseStatValue';
import { validateStats } from '@/utils/ValidateStats';

export const createPlayerStats = async (data: PlayerStatsFormData) => {
	const { gameId, playerId, status } = data;

	// 1️⃣ Check for existing entry
	const duplicateRes = await apiClient.get(
		API_ROUTES.create.playerStatsCheckDuplicate(gameId, playerId)
	);

	if (duplicateRes.data.isDuplicate) {
		throw new Error('Player stats for this game and player already exist.');
	}

	// 2️⃣ If DNP-CD → skip all stat validations & clear stats
	if (status === 'dnp-cd') {
		const payload = {
			game: data.gameId,
			team: data.teamId,
			player: data.playerId,
			status: data.status,
			isCaptain: data.isCaptain,
			playerNumber: data.playerNumber || '',
			minutes: undefined,
			seconds: undefined,
			points: undefined,
			fieldGoalsMade: undefined,
			fieldGoalsAttempted: undefined,
			threePointersMade: undefined,
			threePointersAttempted: undefined,
			freeThrowsMade: undefined,
			freeThrowsAttempted: undefined,
			rebounds: undefined,
			offensiveRebounds: undefined,
			defensiveRebounds: undefined,
			assists: undefined,
			steals: undefined,
			blocks: undefined,
			turnovers: undefined,
			fouls: undefined,
			foulsOn: undefined,
			efficiency: undefined,
			plusMinus: undefined
		};

		const res = await apiClient.post(API_ROUTES.create.playerStats(), { data: payload });
		return res;
	}

	// 3️⃣ Normal validation for active players — use shared validator
	validateStats(data, { checkPlayer: true });

	// 4️⃣ Build payload for active players
	const payload = {
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
		efficiency: num(data.efficiency),
		plusMinus: num(data.plusMinus)
	};

	const res = await apiClient.post(API_ROUTES.create.playerStats(), { data: payload });
	return res;
};
