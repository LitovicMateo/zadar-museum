import * as z from 'zod';

export const playerSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	// convert empty string to null so API receives null instead of ''
	date_of_birth: z.string().optional(),
	date_of_death: z.string().optional(),
	nationality: z.string().min(1),
	active_player: z.boolean(),
	primary_position: z.string().min(1),
	secondary_position: z.string().nullable(),
	height: z.string().optional(),
	image: z.any().nullable()
});
export type PlayerFormData = z.infer<typeof playerSchema>;
