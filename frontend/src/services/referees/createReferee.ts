import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { RefereeFormData } from '@/types/api/referee';

export const createReferee = async (data: RefereeFormData) => {
	return apiClient.post(API_ROUTES.create.referee(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality ?? null
		}
	});
};
