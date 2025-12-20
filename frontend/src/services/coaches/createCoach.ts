import { API_ROUTES } from '@/constants/routes';
import { CoachFormData } from '@/schemas/coach-schema';
import apiClient from '@/services/apiClient';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const createCoach = async (data: CoachFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existingCoach = await apiClient.get(API_ROUTES.create.coach(params.toString()));

	if (!existingCoach || existingCoach.status >= 400) {
		throw new Error('Failed to validate existing coach');
	}

	if (existingCoach.data?.data?.length > 0) {
		throw new Error('Coach already exists');
	}

	const coachPayload = {
		first_name: data.first_name,
		last_name: data.last_name,
		date_of_birth: data.date_of_birth || null,
		image: uploadedImageId,
		nationality: data.nationality
	};

	const res = await apiClient.post(API_ROUTES.create.coach(), {
		data: coachPayload
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createCoach failed: ${res.status}`);
};
