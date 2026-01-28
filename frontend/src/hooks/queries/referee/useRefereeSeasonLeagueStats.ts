import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereSeasonStatsResponse } from '@/types/api/referee';

export const useRefereeSeasonLeagueStats = (refereeId: string | undefined, season: string) => {
	return useQuery({
		queryKey: ['seasonLeagueStats', refereeId, season],
		queryFn: getRefereeSeasonLeagueStats.bind(null, refereeId, season),
		enabled: !!refereeId,
		errorMessage: 'Failed to load season league statistics'
	});
};

const getRefereeSeasonLeagueStats = async (
	refereeId: string | undefined,
	season: string
): Promise<RefereSeasonStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasonLeagueStats(refereeId!, season));

	const data = res.data;

	return data;
};
