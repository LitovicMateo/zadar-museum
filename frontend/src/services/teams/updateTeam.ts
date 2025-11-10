import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { TeamFormData } from '@/schemas/team-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';
import axios from 'axios';

export const updateTeam = async ({ id, ...data }: { id: string } & TeamFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const res = await axios.put(API_ROUTES.edit.team(id), {
		data: {
			name: data.name,
			alternate_names: data.alternate_names,
			short_name: data.short_name,
			slug: slugify(data.name),
			city: data.city,
			image: uploadedImageId,
			country: data.country
		}
	});

	return res;
};
