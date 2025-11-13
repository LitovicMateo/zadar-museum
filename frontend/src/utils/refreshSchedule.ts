import { API_ROUTES } from '@/constants/routes';
import axios from 'axios';

export const refreshSchedule = async () => {
	try {
		const res = await axios.get(API_ROUTES.refresh.schedule);

		if (!res.data.success) {
			throw new Error(res.data?.message || 'Failed to refresh views');
		}

		const data = res.data;
		return data;
	} catch (err) {
		console.error(err);
	}
};
