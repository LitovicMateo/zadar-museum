import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { CompetitionFormData } from '@/types/api/competition';

export const createCompetiton = async (data: CompetitionFormData) => {
	return apiClient.post(API_ROUTES.create.competition(), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies
		}
	});
};
