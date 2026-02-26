import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/staff-member';

type StaffKey = keyof StaffDetailsResponse;

export const useStaffs = (sortKey?: StaffKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['staff', sortKey, direction],
		queryFn: getAllStaffs.bind(null, sortKey, direction),
		errorMessage: 'Failed to load staff'
	});
};

const getAllStaffs = async (sortKey?: StaffKey, direction: 'asc' | 'desc' = 'asc'): Promise<StaffDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey as string);
		params.append('direction', direction);
	}

	// Use the collection endpoint for staff list (stable CRUD route)
	const res = await apiClient.get(API_ROUTES.staff.list(params.toString()));

	return res.data.data;
};
