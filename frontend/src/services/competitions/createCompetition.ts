import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { CompetitionFormData } from '@/types/api/competition';
import axios from 'axios';

export const createCompetiton = async (data: CompetitionFormData) => {
	return axios.post(API_ROUTES.create.competition(), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies
		}
	});
};
