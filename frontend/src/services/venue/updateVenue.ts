import { API_ROUTES } from '@/constants/routes';
import { VenueFormData } from '@/schemas/venue-schema';
import axios from 'axios';

export const updateVenue = async ({ id, ...data }: { id: string } & VenueFormData) => {
	const res = await axios.put(API_ROUTES.edit.venue(id), {
		data: {
			name: data.name,
			city: data.city,
			country: data.country
		}
	});

	return res;
};
