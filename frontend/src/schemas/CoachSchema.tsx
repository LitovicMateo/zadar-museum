// schemas/coachSchema.ts
import * as z from 'zod';

export const coachSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	date_of_birth: z.string().nullable().optional(),
	date_of_death: z.string().nullable().optional(),
	nationality: z.string().nullable().optional(),
	image: z.any().nullable().optional()
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

export type CoachFormData = z.infer<typeof coachSchema>;
