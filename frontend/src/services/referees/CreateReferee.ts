import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { RefereeFormData } from '@/types/api/Referee';

export const createReferee = async (data: RefereeFormData) => {
	return apiClient.post(API_ROUTES.create.referee(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality ?? null
		}
	});
};
