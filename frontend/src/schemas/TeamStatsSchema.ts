import * as z from 'zod';

export const teamStatsSchema = z
	.object({
		season: z.string().length(4),
		league: z.string().min(1),
		gameId: z.string(),
		teamId: z.string(),
		coachId: z.string(),
		assistantCoachId: z.string(),
		// Quarter and half fields are mutually exclusive per game: the form renders
		// only the set matching the game's period_format, and the create/update
		// services write the other set as null.
		firstQuarter: z.string(),
		secondQuarter: z.string(),
		thirdQuarter: z.string(),
		fourthQuarter: z.string(),
		firstHalf: z.string(),
		secondHalf: z.string(),
		overtime: z.string().nullable(),
		// Only for games where the period scoring is unknown.
		final_score: z.string(),
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

		const periodKeys = [
			'firstQuarter',
			'secondQuarter',
			'thirdQuarter',
			'fourthQuarter',
			'firstHalf',
			'secondHalf',
			'overtime'
		] as const;
		const periodValues = periodKeys.map((k) => data[k]).filter((v) => v != null && v.trim() !== '');
		const hasFinal = data.final_score.trim() !== '';

		if (periodValues.length === 0 && !hasFinal) {
			ctx.addIssue({
				code: 'custom',
				path: ['final_score'],
				message: 'Enter the period scores or the final score.'
			});
		} else if (periodValues.length > 0 && hasFinal) {
			const sum = periodValues.reduce((acc, v) => acc + Number(v), 0);
			if (sum !== Number(data.final_score)) {
				ctx.addIssue({
					code: 'custom',
					path: ['final_score'],
					message: `Final score (${data.final_score}) does not match the period total (${sum}).`
				});
			}
		}

		checkRatio('fieldGoalsMade', 'fieldGoalsAttempted', 'Field goals');
		checkRatio('threePointersMade', 'threePointersAttempted', 'Three-pointers');
		checkRatio('freeThrowsMade', 'freeThrowsAttempted', 'Free throws');
	});

export type TeamStatsFormData = z.infer<typeof teamStatsSchema>;
