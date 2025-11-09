import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { CompetitionFormData } from '@/schemas/competition-schema';
import axios from 'axios';

export const updateCompetition = async ({ id, ...data }: { id: string } & CompetitionFormData) => {
	const res = await axios.put(API_ROUTES.edit.competition(id), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies
		}
	});

	return res;
};
