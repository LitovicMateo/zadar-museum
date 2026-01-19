import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereeStatsResponse } from '@/types/api/referee';

export const useRefereeTeamRecord = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'team-record', refereeId],
		queryFn: getRefereeTeamRecord.bind(null, refereeId),
		enabled: !!refereeId,
		errorMessage: 'Failed to load team record'
	});
};

const getRefereeTeamRecord = async (refereeId: string): Promise<RefereeStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.referee.teamRecord(refereeId));
	return res.data;
};
