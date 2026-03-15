import * as z from 'zod';

export const competitionSchema = z.object({
	name: z.string().min(1),
	// allow short_name of either 2 or 3 characters
	short_name: z.string().min(2).max(3),
	alternate_names: z.array(z.object({ name: z.string().min(1), short_name: z.string().min(2).max(3) })),
	trophies: z.array(z.string().length(4)) // years when won
});

export type CompetitionFormData = z.infer<typeof competitionSchema>;
