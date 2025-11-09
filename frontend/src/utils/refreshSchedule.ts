import axios from 'axios';

export const refreshSchedule = async () => {
	try {
		const res = await axios.get('http://localhost:1337/api/refresh/schedule');

		if (!res.data.success) {
			throw new Error(res.data?.message || 'Failed to refresh views');
		}

		const data = res.data;
		return data;
	} catch (err) {
		console.error(err);
	}
};
