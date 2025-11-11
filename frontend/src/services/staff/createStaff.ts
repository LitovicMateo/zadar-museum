import { API_ROUTES } from '@/constants/routes';
import { StaffFormData } from '@/schemas/staff-schema';
import axios from 'axios';

export const createStaff = async (data: StaffFormData) => {
	// Check for existing staff with same first and last name
	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existing = await axios.get(API_ROUTES.create.staff(params.toString()));

	if (existing.data && existing.data.data && existing.data.data.length > 0) {
		throw new Error('Staff already exists');
	}

	return axios.post(API_ROUTES.create.staff(), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role
		}
	});
};
