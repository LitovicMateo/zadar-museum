import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { CompetitionFormData } from '@/types/api/Competition';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const createCompetiton = async (data: CompetitionFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	return apiClient.post(API_ROUTES.create.competition(), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies,
			image: uploadedImageId
		}
	});
};
