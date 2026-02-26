import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { TeamFormData } from '@/schemas/team-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const createTeam = async (data: TeamFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const filterAlternate = data.alternate_names.filter((t) => t.name !== '');

	const alternate_names = filterAlternate.map((alt) => ({
		...alt,
		short_name: alt.short_name.toUpperCase()
	}));

	return apiClient.post(API_ROUTES.create.team(), {
		data: {
			name: data.name,
			short_name: data.short_name.toUpperCase(),
			slug: slugify(data.name),
			city: data.city,
			image: uploadedImageId,
			country: data.country,
			alternate_names: alternate_names
		}
	});
};
