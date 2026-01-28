import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { StaffFormData } from '@/schemas/staff-schema';

export const updateStaff = async ({ id, ...data }: { id: string } & StaffFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.staff(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role
		}
	});

	return res;
};
