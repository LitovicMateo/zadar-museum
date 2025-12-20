import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { TeamFormData } from '@/schemas/team-schema';
import apiClient from '@/services/apiClient';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const createTeam = async (data: TeamFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const filterAlternate = data.alternate_names.filter((t) => t.name !== '');

	const alternate_names = filterAlternate.map((alt) => ({
		...alt,
		short_name: alt.short_name.toUpperCase()
	}));

	const res = await apiClient.post(API_ROUTES.create.team(), {
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

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createTeam failed: ${res.status}`);
};
