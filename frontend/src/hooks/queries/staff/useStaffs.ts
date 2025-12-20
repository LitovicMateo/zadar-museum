import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/staff-member';
import { useQuery } from '@tanstack/react-query';

type StaffKey = keyof StaffDetailsResponse;

export const useStaffs = (sortKey?: StaffKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['staff', sortKey, direction],
		queryFn: getAllStaffs.bind(null, sortKey, direction)
	});
};

const getAllStaffs = async (sortKey?: StaffKey, direction: 'asc' | 'desc' = 'asc'): Promise<StaffDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey as string);
		params.append('direction', direction);
	}

	// Use the collection endpoint for staff list (stable CRUD route)
	const res = await apiClient.get<{ data?: unknown[] }>(API_ROUTES.staff.list(params.toString()));

	return res.data.data;
};
