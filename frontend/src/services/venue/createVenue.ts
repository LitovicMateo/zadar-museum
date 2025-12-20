import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { VenueFormData } from '@/types/api/venue';

export const createVenue = async (data: VenueFormData) => {
	const res = await apiClient.post(API_ROUTES.create.venue(), {
		data: {
			name: data.name,
			city: data.city,
			slug: slugify(data.name),
			country: data.country
		}
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createVenue failed: ${res.status}`);
};
