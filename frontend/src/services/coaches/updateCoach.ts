import { API_ROUTES } from '@/constants/routes';
import { CoachFormData } from '@/schemas/coach-schema';
import apiClient from '@/services/apiClient';
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

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateCoach failed: ${res.status}`);
};
