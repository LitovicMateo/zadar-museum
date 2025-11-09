import { API_ROUTES } from '@/constants/routes';
import { RefereeFormData } from '@/types/api/referee';
import axios from 'axios';

export const createReferee = async (data: RefereeFormData) => {
	return axios.post(API_ROUTES.create.referee(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality
		}
	});
};
