import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { VenueFormData } from '@/types/api/venue';

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
