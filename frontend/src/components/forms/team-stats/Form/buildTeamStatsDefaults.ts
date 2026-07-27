import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';
import { TeamStatsResponse } from '@/types/api/TeamStats';

/**
 * Builds the react-hook-form default values for the team-stats form from a
 * loaded record. Shared by TeamStatsFormPage (initial mount) and
 * TeamStatsFormProvider (async reset) so the two never drift.
 */
export const buildTeamStatsDefaults = (teamStat: TeamStatsResponse): TeamStatsFormData => ({
	season: teamStat.game?.season ?? '',
	league: teamStat.game?.competition?.documentId ?? '',
	gameId: teamStat.game?.id?.toString() ?? '',
	teamId: teamStat.team?.id?.toString() ?? '',
	coachId: teamStat.coach?.id?.toString() ?? '',
	assistantCoachId: teamStat.assistantCoach?.id?.toString() ?? '',
	firstQuarter: teamStat.firstQuarter?.toString() ?? '',
	secondQuarter: teamStat.secondQuarter?.toString() ?? '',
	thirdQuarter: teamStat.thirdQuarter?.toString() ?? '',
	fourthQuarter: teamStat.fourthQuarter?.toString() ?? '',
	firstHalf: teamStat.firstHalf?.toString() ?? '',
	secondHalf: teamStat.secondHalf?.toString() ?? '',
	// `?? ''` rather than a truthiness check, so a real overtime of 0 survives.
	overtime: teamStat.overtime?.toString() ?? '',
	fieldGoalsMade: teamStat.fieldGoalsMade?.toString() ?? '',
	fieldGoalsAttempted: teamStat.fieldGoalsAttempted?.toString() ?? '',
	threePointersMade: teamStat.threePointersMade?.toString() ?? '',
	threePointersAttempted: teamStat.threePointersAttempted?.toString() ?? '',
	freeThrowsMade: teamStat.freeThrowsMade?.toString() ?? '',
	freeThrowsAttempted: teamStat.freeThrowsAttempted?.toString() ?? '',
	rebounds: teamStat.rebounds?.toString() ?? '',
	offensiveRebounds: teamStat.offensiveRebounds?.toString() ?? '',
	defensiveRebounds: teamStat.defensiveRebounds?.toString() ?? '',
	assists: teamStat.assists?.toString() ?? '',
	turnovers: teamStat.turnovers?.toString() ?? '',
	steals: teamStat.steals?.toString() ?? '',
	blocks: teamStat.blocks?.toString() ?? '',
	fouls: teamStat.fouls?.toString() ?? '',
	secondChancePoints: teamStat.secondChancePoints?.toString() ?? '',
	fastBreakPoints: teamStat.fastBreakPoints?.toString() ?? '',
	pointsOffTurnovers: teamStat.pointsOffTurnovers?.toString() ?? '',
	benchPoints: teamStat.benchPoints?.toString() ?? '',
	pointsInPaint: teamStat.pointsInPaint?.toString() ?? ''
});
