// schemas/coachSchema.ts
import * as z from 'zod';

export const coachSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	date_of_birth: z.string().nullable(),
	nationality: z.string().min(1),
	image: z.any().nullable()
});

export type CoachFormData = z.infer<typeof coachSchema>;
