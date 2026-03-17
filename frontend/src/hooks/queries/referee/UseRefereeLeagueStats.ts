import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { RefereeLeagueStatsResponse } from '@/types/api/Referee';

export const useRefereeLeagueStats = (refereeId: string | undefined) => {
	return useQuery({
		queryKey: ['referee-league-stats', refereeId],
		queryFn: getRefereeLeagueStats.bind(null, refereeId!),
		enabled: !!refereeId,
		errorMessage: 'Failed to load referee league statistics'
	});
};

const getRefereeLeagueStats = async (refereeId: string): Promise<RefereeLeagueStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.referee.leagueStats(refereeId));
	return res.data;
};
