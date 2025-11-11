import { API_ROUTES } from '@/constants/routes';
import { StaffDetailsResponse } from '@/types/api/staff';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useStaffDetails = (staffId: string) => {
	return useQuery({
		queryKey: ['staff', staffId],
		queryFn: getStaffDetails.bind(null, staffId),
		enabled: !!staffId
	});
};

const getStaffDetails = async (staffId: string): Promise<StaffDetailsResponse> => {
	const res = await axios.get(API_ROUTES.staff.details(staffId));
	const data = res.data.data;

	return data;
};
