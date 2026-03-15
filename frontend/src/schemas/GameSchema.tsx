import * as z from 'zod';

export const gameSchema = z
	.object({
		season: z.string().min(4),
		round: z.string().min(1),
		group_name: z.string().optional(),
		home_team: z.string().min(1),
		home_team_name: z.string().min(1),
		home_team_short_name: z.string().length(3),
		away_team: z.string().min(1),
		away_team_name: z.string().min(1),
		away_team_short_name: z.string().length(3),
		date: z.string(),
		stage: z.enum(['league', 'group', 'playoff']).nullable(),
		competition: z.string().nullable(),
		league_name: z.string().min(1),
		league_short_name: z.string().max(3),
		venue: z.string().min(1),
		isNeutral: z.boolean(),
		isNulled: z.boolean(),
		forfeited: z.boolean(),
		forfeited_by: z.enum(['home', 'away', 'none']),
		attendance: z.string().optional(),
		mainReferee: z.string().optional(),
		secondReferee: z.string().optional(),
		thirdReferee: z.string().optional(),
		// array of staff member IDs involved in the game
		staffers: z.array(z.string()).optional(),
		gallery: z.any().nullable()
	})
	.superRefine((data, ctx) => {
		if (data.stage === 'group' && (!data.group_name || data.group_name.trim() === '')) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Group name is required for group stage',
				path: ['group_name']
			});
		}
	});

export type GameFormData = z.infer<typeof gameSchema>;
