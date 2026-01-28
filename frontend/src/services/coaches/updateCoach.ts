import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { CoachFormData } from '@/schemas/coach-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const updateCoach = async ({ id, ...data }: { id: string } & CoachFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);
	const res = await apiClient.put(API_ROUTES.edit.coach(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			date_of_birth: data.date_of_birth || null,
			image: uploadedImageId,
			nationality: data.nationality
		}
	});

	return res;
};
