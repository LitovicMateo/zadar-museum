import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { VenueFormData } from '@/types/api/venue';
import axios from 'axios';

export const createVenue = async (data: VenueFormData) => {
	return axios.post(API_ROUTES.create.venue(), {
		data: {
			name: data.name,
			city: data.city,
			slug: slugify(data.name),
			country: data.country
		}
	});
};
