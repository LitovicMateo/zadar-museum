import { API_ROUTES } from '@/constants/routes';
import { CoachFormData } from '@/schemas/coach-schema';
import axios from 'axios';

export const createCoach = async (data: CoachFormData) => {
	return axios.post(API_ROUTES.create.coach(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			date_of_birth: data.date_of_birth || null,
			image: data.image || null,
			nationality: data.nationality
		}
	});
};
