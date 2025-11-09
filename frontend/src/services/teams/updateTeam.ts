import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { TeamFormData } from '@/schemas/team-schema';
import axios from 'axios';

export const updateTeam = async ({ id, ...data }: { id: string } & TeamFormData) => {
	const res = await axios.put(API_ROUTES.edit.team(id), {
		data: {
			name: data.name,
			alternate_names: data.alternate_names,
			short_name: data.short_name,
			slug: slugify(data.name),
			city: data.city,
			image: data.image.id || null,
			country: data.country
		}
	});

	return res;
};
