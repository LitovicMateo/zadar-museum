import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

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
