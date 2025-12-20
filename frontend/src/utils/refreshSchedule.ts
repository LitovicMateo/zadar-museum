import { API_ROUTES } from '@/constants/routes';
import { unwrapSingle } from '@/services/apiClient';
import axios from 'axios';

export const refreshSchedule = async () => {
	try {
		const res = await axios.get(API_ROUTES.refresh.schedule);

		const data = unwrapSingle<{ success: boolean; message?: string }>(res as unknown as { data?: unknown });

		if (!data.success) {
			throw new Error(data?.message || 'Failed to refresh views');
		}

		return data;
	} catch (err) {
		console.error(err);
	}
};
