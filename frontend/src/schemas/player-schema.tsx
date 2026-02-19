import * as z from 'zod';

export const playerSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	// convert empty string to null so API receives null instead of ''
	date_of_birth: z.string().optional(),
	date_of_death: z.string().optional(),
	nationality: z.string().nullable().optional(),
	active_player: z.boolean(),
	primary_position: z.string().nullable().optional(),
	secondary_position: z.string().nullable(),
	height: z.string().optional(),
	image: z.any().nullable()
}).superRefine((data, ctx) => {
	const { date_of_birth: dob, date_of_death: dod } = data;
	if (dob && dod) {
		const dobDate = new Date(dob as string);
		const dodDate = new Date(dod as string);
		if (!isNaN(dobDate.getTime()) && !isNaN(dodDate.getTime())) {
			if (dobDate > dodDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Date of birth cannot be after date of death',
					path: ['date_of_death']
				});
			}
		}
	}
});
export type PlayerFormData = z.infer<typeof playerSchema>;
