import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/staff-member';
import { useQuery } from '@tanstack/react-query';

export const useStaffDetails = (staffId: string) => {
	return useQuery({
		queryKey: ['staff', staffId],
		queryFn: getStaffDetails.bind(null, staffId),
		enabled: !!staffId
	});
};

const getStaffDetails = async (staffId: string): Promise<StaffDetailsResponse> => {
	const res = await apiClient.get<{ data: StaffDetailsResponse }>(API_ROUTES.staff.details(staffId));
	const data = res.data.data;

	return data;
};
