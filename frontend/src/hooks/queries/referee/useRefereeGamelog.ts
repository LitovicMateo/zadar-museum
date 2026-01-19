import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamScheduleResponse } from '@/types/api/team';

export const useRefereeGamelog = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'gamelog', refereeId],
		queryFn: getRefereeGamelog.bind(null, refereeId),
		enabled: !!refereeId,
		errorMessage: 'Failed to load referee gamelog'
	});
};

const getRefereeGamelog = async (refereeId: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.referee.gamelog(refereeId));
	const data = res.data;

	return data;
};
