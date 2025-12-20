import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { RefereeFormData } from '@/types/api/referee';

export const createReferee = async (data: RefereeFormData) => {
	const res = await apiClient.post(API_ROUTES.create.referee(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality
		}
	});

	if (res.status >= 200 && res.status < 300) return unwrapSingle(res as unknown as { data?: unknown });
	throw new Error(`createReferee failed: ${res.status}`);
};
