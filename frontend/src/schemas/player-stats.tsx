import * as z from 'zod';

export const playerStatsSchema = z.object({
	season: z.string().length(4),
	league: z.string(),
	gameId: z.string(),
	teamId: z.string(),
	playerId: z.string(),
	status: z.enum(['starter', 'bench', 'dnp-cd']),
	isCaptain: z.boolean(),
	playerNumber: z.string(),
	minutes: z.string(),
	seconds: z.string(),
	points: z.string(),
	fieldGoalsMade: z.string(),
	fieldGoalsAttempted: z.string(),
	threePointersMade: z.string(),
	threePointersAttempted: z.string(),
	freeThrowsMade: z.string(),
	freeThrowsAttempted: z.string(),
	rebounds: z.string(),
	offensiveRebounds: z.string(),
	defensiveRebounds: z.string(),
	assists: z.string(),
	steals: z.string(),
	blocks: z.string(),
	turnovers: z.string(),
	fouls: z.string(),
	foulsOn: z.string(),
	blocksReceived: z.string(),
	plusMinus: z.string(),
	efficiency: z.string()
});

export type PlayerStatsFormData = z.infer<typeof playerStatsSchema>;
