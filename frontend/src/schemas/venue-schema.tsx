import * as z from 'zod';

export const venueSchema = z.object({
	name: z.string().min(1),
	city: z.string().min(1),
	country: z.string().min(1)
});

export type VenueFormData = z.infer<typeof venueSchema>;
