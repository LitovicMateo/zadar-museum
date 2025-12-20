import { API_ROUTES } from '@/constants/routes';
import { RefereeFormData } from '@/schemas/referee-schema';
import apiClient from '@/services/apiClient';

export const updateReferee = async ({ id, ...data }: { id: string } & RefereeFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.referee(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality
		}
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateReferee failed: ${res.status}`);
};
