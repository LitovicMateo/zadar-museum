import { API_ROUTES } from '@/constants/routes';
import { StaffFormData } from '@/schemas/staff-schema';
import apiClient from '@/services/apiClient';

export const createStaff = async (data: StaffFormData) => {
	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existing = await apiClient.get<{ data?: unknown[] }>(API_ROUTES.create.staff(params.toString()));
	if (existing.data?.data && existing.data.data.length > 0) {
		throw new Error('Staff already exists');
	}

	const res = await apiClient.post(API_ROUTES.create.staff(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role
		}
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createStaff failed: ${res.status}`);
};
