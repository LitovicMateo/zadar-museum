import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamScheduleResponse } from '@/types/api/team';

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
