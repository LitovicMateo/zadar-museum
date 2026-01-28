import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';

export const refreshSchedule = async () => {
	try {
		const res = await apiClient.get(API_ROUTES.refresh.schedule);

		if (!res.data.success) {
			throw new Error(res.data?.message || 'Failed to refresh views');
		}

		const data = res.data;
		return data;
	} catch (err) {
		console.error(err);
	}
};
