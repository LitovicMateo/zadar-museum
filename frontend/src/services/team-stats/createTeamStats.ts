import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';
import { validateStats } from '@/utils/validateStats';

export const createTeamStats = async (data: TeamStatsFormData) => {
	const { teamId, gameId } = data;

	const params = new URLSearchParams({
		'filters[game][id][$eq]': gameId,
		'filters[team][id][$eq]': teamId
	});

	// check if already exists
	const existingRes = await apiClient.get(API_ROUTES.create.teamStats(params.toString()));

	if (existingRes.data.data.length > 0) {
		throw new Error('Team stats for this game and team already exist.');
	}

	// 🔍 Validation: use shared validator for team-specific checks
	validateStats(data, { checkTeam: true });

	const payload = {
		// filters
		game: data.gameId,
		team: data.teamId,

		// coaches
		coach: data.coachId ? +data.coachId : undefined,
		assistantCoach: data.assistantCoachId ? +data.assistantCoachId : undefined,

		// score
		firstQuarter: data.firstQuarter !== null ? +data.firstQuarter : null,
		secondQuarter: data.secondQuarter !== null ? +data.secondQuarter : null,
		thirdQuarter: data.thirdQuarter !== null ? +data.thirdQuarter : null,
		fourthQuarter: data.fourthQuarter !== null ? +data.fourthQuarter : null,
		overtime: data.overtime !== null ? +data.overtime! : null,

		// shooting
		fieldGoalsMade: data.fieldGoalsMade ? +data.fieldGoalsMade : undefined,
		fieldGoalsAttempted: data.fieldGoalsAttempted ? +data.fieldGoalsAttempted : undefined,

		threePointersMade: data.threePointersMade ? +data.threePointersMade : undefined,
		threePointersAttempted: data.threePointersAttempted ? +data.threePointersAttempted : undefined,

		freeThrowsMade: data.freeThrowsMade ? +data.freeThrowsMade : undefined,
		freeThrowsAttempted: data.freeThrowsAttempted ? +data.freeThrowsAttempted : undefined,

		// rebounds
		offensiveRebounds: data.rebounds ? undefined : +data.offensiveRebounds,
		defensiveRebounds: data.rebounds ? undefined : +data.defensiveRebounds,
		rebounds: data.rebounds ? +data.rebounds : +data.offensiveRebounds + +data.defensiveRebounds,

		// passing
		assists: data.assists ? +data.assists : undefined,
		turnovers: data.turnovers ? +data.turnovers : undefined,

		// defense
		steals: data.steals ? +data.steals : undefined,
		blocks: data.blocks ? +data.blocks : undefined,
		fouls: data.fouls ? +data.fouls : undefined,

		// misc
		secondChancePoints: data.secondChancePoints ? +data.secondChancePoints : undefined,
		fastBreakPoints: data.fastBreakPoints ? +data.fastBreakPoints : undefined,
		pointsOffTurnovers: data.pointsOffTurnovers ? +data.pointsOffTurnovers : undefined,
		benchPoints: data.benchPoints ? +data.benchPoints : undefined,
		pointsInPaint: data.pointsInPaint ? +data.pointsInPaint : undefined
	};

	const res = await apiClient.post(API_ROUTES.create.teamStats(), { data: payload });
	return res;
};
