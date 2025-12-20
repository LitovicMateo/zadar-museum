import { API_ROUTES } from '@/constants/routes';
import { VenueFormData } from '@/schemas/venue-schema';
import apiClient from '@/services/apiClient';

export const updateVenue = async ({ id, ...data }: { id: string } & VenueFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.venue(id), {
		data: {
			name: data.name,
			city: data.city,
			country: data.country
		}
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateVenue failed: ${res.status}`);
};
