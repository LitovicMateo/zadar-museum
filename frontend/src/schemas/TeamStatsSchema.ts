import * as z from 'zod';

export const teamStatsSchema = z
	.object({
		season: z.string().length(4),
		league: z.string().min(1),
		gameId: z.string(),
		teamId: z.string(),
		coachId: z.string(),
		assistantCoachId: z.string(),
		firstQuarter: z.string(),
		secondQuarter: z.string(),
		thirdQuarter: z.string(),
		fourthQuarter: z.string(),
		overtime: z.string().nullable(),
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
		secondChancePoints: z.string(),
		fastBreakPoints: z.string(),
		pointsOffTurnovers: z.string(),
		benchPoints: z.string(),
		pointsInPaint: z.string()
	})
	.superRefine((data, ctx) => {
		const checkRatio = (madeKey: keyof typeof data, attKey: keyof typeof data, label: string) => {
			const made = Number(data[madeKey]);
			const attempted = Number(data[attKey]);

			if (!isNaN(made) && !isNaN(attempted) && made > attempted) {
				ctx.addIssue({
					code: 'custom',
					path: [madeKey],
					message: `${label}: made (${made}) cannot be greater than attempted (${attempted}).`
				});
			}
		};

		checkRatio('fieldGoalsMade', 'fieldGoalsAttempted', 'Field goals');
		checkRatio('threePointersMade', 'threePointersAttempted', 'Three-pointers');
		checkRatio('freeThrowsMade', 'freeThrowsAttempted', 'Free throws');
	});

export type TeamStatsFormData = z.infer<typeof teamStatsSchema>;
