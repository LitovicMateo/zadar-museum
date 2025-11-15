import { API_ROUTES } from '@/constants/routes';
import { TeamStatsFormData } from '@/schemas/team-stats-schema';
import axios from 'axios';

export const updateTeamStats = async ({ id, ...data }: { id: string } & TeamStatsFormData) => {
	// 🔍 Validation: shooting stats
	if (data.fieldGoalsMade && data.fieldGoalsAttempted && +data.fieldGoalsMade > +data.fieldGoalsAttempted) {
		throw new Error('Field goals made cannot be greater than field goals attempted.');
	}
	if (
		data.threePointersMade &&
		data.threePointersAttempted &&
		+data.threePointersMade > +data.threePointersAttempted
	) {
		throw new Error('Three-pointers made cannot be greater than three-pointers attempted.');
	}
	if (data.freeThrowsMade && data.freeThrowsAttempted && +data.freeThrowsMade > +data.freeThrowsAttempted) {
		throw new Error('Free throws made cannot be greater than free throws attempted.');
	}

	// 🔍 Validation: quarter scores (if provided, must be >= 0)
	const quarters = [
		{ name: 'First quarter', value: data.firstQuarter },
		{ name: 'Second quarter', value: data.secondQuarter },
		{ name: 'Third quarter', value: data.thirdQuarter },
		{ name: 'Fourth quarter', value: data.fourthQuarter },
		{ name: 'Overtime', value: data.overtime }
	];

	for (const q of quarters) {
		if (q.value !== null && q.value !== undefined && +q.value < 0) {
			throw new Error(`${q.name} score cannot be negative.`);
		}
	}

	const res = await axios.put(API_ROUTES.edit.teamStats(id), {
		data: {
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
		}
	});
	return res;
};
