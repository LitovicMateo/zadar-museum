import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { TeamFormData } from '@/schemas/team-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';
import axios from 'axios';

export const createTeam = async (data: TeamFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const filterAlternate = data.alternate_names.filter((t) => t.name !== '');

	return axios.post(API_ROUTES.create.team(), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			city: data.city,
			image: uploadedImageId,
			country: data.country,
			alternate_names: filterAlternate
		}
	});
};
