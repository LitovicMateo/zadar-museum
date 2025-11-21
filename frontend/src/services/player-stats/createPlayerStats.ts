import { API_ROUTES } from '@/constants/routes';
import { PlayerStatsFormData } from '@/schemas/player-stats';
import { validateStats } from '@/utils/validateStats';
import axios from 'axios';

export const createPlayerStats = async (data: PlayerStatsFormData) => {
	const { gameId, playerId, status } = data;

	const params = new URLSearchParams({
		'filters[game][id][$eq]': gameId,
		'filters[player][id][$eq]': playerId
	});

	// 1️⃣ Check for existing entry
	const existingRes = await axios.get(API_ROUTES.create.playerStats(params.toString()));

	if (existingRes.data.data.length > 0) {
		throw new Error('Player stats for this game, team, and player already exist.');
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

		const res = await axios.post(API_ROUTES.create.playerStats(), { data: payload });
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
	};

	const res = await axios.post(API_ROUTES.create.playerStats(), { data: payload });
	return res;
};
