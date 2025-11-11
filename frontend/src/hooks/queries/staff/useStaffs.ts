import { API_ROUTES } from '@/constants/routes';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/staff-member';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

	console.log(params);

	// Use the collection endpoint for staff list (stable CRUD route)
	const res = await axios.get(API_ROUTES.staff.list(params.toString()));

	return res.data.data;
};
