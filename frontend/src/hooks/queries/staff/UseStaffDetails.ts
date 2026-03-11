import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { StaffMemberDetailsResponse as StaffDetailsResponse } from '@/types/api/StaffMember';

export const useStaffDetails = (staffId: string) => {
	return useQuery({
		queryKey: ['staff', staffId],
		queryFn: getStaffDetails.bind(null, staffId),
		enabled: !!staffId,
		errorMessage: 'Failed to load staff details'
	});
};

const getStaffDetails = async (staffId: string): Promise<StaffDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.staff.details(staffId));
	const data = res.data.data;

	return data;
};
