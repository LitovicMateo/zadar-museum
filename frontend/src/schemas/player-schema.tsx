import * as z from 'zod';

export const playerSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	date_of_birth: z.string().nullable(),
	date_of_death: z.string().nullable(),
	nationality: z.string().min(1),
	active_player: z.boolean(),
	primary_position: z.string().min(1),
	secondary_position: z.string().nullable(),
	image: z.any().nullable()
});

export type PlayerFormData = z.infer<typeof playerSchema>;
