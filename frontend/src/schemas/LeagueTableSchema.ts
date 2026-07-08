import * as z from 'zod';

const standingRowSchema = z.object({
	team: z.string().min(1, 'Team is required'),
	teamName: z.string(),
	teamShortName: z.string(),
	gamesPlayed: z.string(),
	wins: z.string(),
	draws: z.string(),
	losses: z.string(),
	pointsDiff: z.string(),
	points: z.string()
});

export const leagueTableSchema = z
	.object({
		season: z.string().length(4),
		competition: z.string().min(1, 'Competition is required'),
		stageNumber: z.string().min(1, 'Stage number is required'),
		stageName: z.string(),
		standings: z.array(standingRowSchema).min(1, 'Add at least one position')
	})
	.superRefine((data, ctx) => {
		// A team may only appear once in a standings table.
		const seen = new Map<string, number>();
		data.standings.forEach((row, index) => {
			if (!row.team) return;
			if (seen.has(row.team)) {
				ctx.addIssue({
					code: 'custom',
					path: ['standings', index, 'team'],
					message: 'This team is already in the table.'
				});
			} else {
				seen.set(row.team, index);
			}
		});
	});

export type LeagueTableFormData = z.infer<typeof leagueTableSchema>;
export type StandingRowFormData = z.infer<typeof standingRowSchema>;
