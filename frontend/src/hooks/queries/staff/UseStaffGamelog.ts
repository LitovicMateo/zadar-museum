import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

export const useStaffGamelog = (staffId: string) => {
	return useQuery({
		queryKey: ['staff', 'gamelog', staffId],
		queryFn: getStaffGamelog.bind(null, staffId),
		enabled: !!staffId,
		errorMessage: 'Failed to load staff gamelog'
	});
};

const getStaffGamelog = async (staffId: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.staff.gamelog(staffId));
	return res.data;
};
