import { API_ROUTES } from '@/constants/routes';
import { RefereeFormData } from '@/schemas/referee-schema';
import axios from 'axios';

export const updateReferee = async ({ id, ...data }: { id: string } & RefereeFormData) => {
	const res = await axios.put(API_ROUTES.edit.referee(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality
		}
	});

	return res;
};
