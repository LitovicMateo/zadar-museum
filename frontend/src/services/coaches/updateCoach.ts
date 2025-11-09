import { API_ROUTES } from '@/constants/routes';
import { CoachFormData } from '@/schemas/coach-schema';
import axios from 'axios';

export const updateCoach = async ({ id, ...data }: { id: string } & CoachFormData) => {
	const res = await axios.put(API_ROUTES.edit.coach(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			date_of_birth: data.date_of_birth || null,
			image: data.image || null,
			nationality: data.nationality
		}
	});

	return res;
};
