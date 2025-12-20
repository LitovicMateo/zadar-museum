import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { RefereeStatsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';

export const useRefereeTeamRecord = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'team-record', refereeId],
		queryFn: getRefereeTeamRecord.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeTeamRecord = async (refereeId: string): Promise<RefereeStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.referee.teamRecord(refereeId));

	return unwrapSingle<RefereeStatsResponse>(res as unknown as { data?: unknown }) as RefereeStatsResponse;
};
