import * as z from 'zod';

export const competitionSchema = z.object({
	name: z.string().min(1),
	short_name: z.string().length(3),
	alternate_names: z.array(z.object({ name: z.string().min(1), short_name: z.string().length(3) })),
	trophies: z.array(z.string().length(4)) // years when won
});

export type CompetitionFormData = z.infer<typeof competitionSchema>;

/*
type CompetitionFormData = {
	name: string;
	short_name: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
};
*/
