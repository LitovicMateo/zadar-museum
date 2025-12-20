import { API_ROUTES } from '@/constants/routes';
import { StaffFormData } from '@/schemas/staff-schema';
import apiClient from '@/services/apiClient';

export const updateStaff = async ({ id, ...data }: { id: string } & StaffFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.staff(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role
		}
	});

	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateStaff failed: ${res.status}`);
};
