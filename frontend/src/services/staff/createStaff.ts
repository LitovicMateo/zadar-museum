import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { StaffFormData } from '@/schemas/staff-schema';

export const createStaff = async (data: StaffFormData) => {
	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existing = await apiClient.get(API_ROUTES.create.staff(params.toString()));
	if (existing.data && existing.data.data && existing.data.data.length > 0) {
		throw new Error('Staff already exists');
	}

	return apiClient.post(API_ROUTES.create.staff(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role
		}
	});
};
