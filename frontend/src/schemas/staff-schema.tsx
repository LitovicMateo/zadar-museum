// schemas/staff-schema.ts
import * as z from 'zod';

export const staffSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	role: z.enum(['Assistant coach', 'Fitness coach', 'Doctor', 'Physio'])
});

export type StaffFormData = z.infer<typeof staffSchema>;
