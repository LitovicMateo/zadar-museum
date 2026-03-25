import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { CompetitionFormData } from '@/schemas/CompetitionSchema';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const updateCompetition = async ({ id, ...data }: { id: string } & CompetitionFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const res = await apiClient.put(API_ROUTES.edit.competition(id), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies,
			image: uploadedImageId
		}
	});

	return res;
};
