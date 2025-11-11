import { API_ROUTES } from '@/constants/routes';
import { StaffDetailsResponse } from '@/types/api/staff';
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

	const res = await axios.get(API_ROUTES.dashboard.staff(params.toString()));

	return res.data;
};
