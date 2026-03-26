import * as z from 'zod';

export const refereeSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	nationality: z.string().nullable().optional(),
	image: z.any().nullable().optional()
});

export type RefereeFormData = z.infer<typeof refereeSchema>;
