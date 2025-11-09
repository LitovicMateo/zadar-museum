import * as z from 'zod';

export const teamSchema = z.object({
	name: z.string().min(1),
	alternate_names: z.array(z.object({ name: z.string().min(1), short_name: z.string().length(3) })),
	short_name: z.string().length(3),
	city: z.string().min(1),
	country: z.string().min(1),
	image: z.any().nullable()
});

export type TeamFormData = z.infer<typeof teamSchema>;
