import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { VenueFormData } from '@/schemas/venue-schema';

export const updateVenue = async ({ id, ...data }: { id: string } & VenueFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.venue(id), {
		data: {
			name: data.name,
			city: data.city,
			country: data.country
		}
	});

	return res;
};
