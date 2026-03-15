import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { VenueFormData } from '@/types/api/Venue';

export const createVenue = async (data: VenueFormData) => {
	return apiClient.post(API_ROUTES.create.venue(), {
		data: {
			name: data.name,
			city: data.city,
			slug: slugify(data.name),
			country: data.country
		}
	});
};
