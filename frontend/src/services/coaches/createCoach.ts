import { API_ROUTES } from '@/constants/routes';
import { CoachFormData } from '@/schemas/coach-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';
import axios from 'axios';

export const createCoach = async (data: CoachFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existingCoach = await axios.get(API_ROUTES.create.coach(params.toString()));

	if (existingCoach.data.data.length > 0) {
		throw new Error('Coach already exists');
	}

	const coachPayload = {
		first_name: data.first_name,
		last_name: data.last_name,
		date_of_birth: data.date_of_birth || null,
		image: uploadedImageId,
		nationality: data.nationality
	};

	return axios.post(API_ROUTES.create.coach(), {
		data: coachPayload
	});
};
