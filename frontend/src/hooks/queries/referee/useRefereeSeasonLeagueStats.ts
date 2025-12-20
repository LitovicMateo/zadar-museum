import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { RefereSeasonStatsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';

export const useRefereeSeasonLeagueStats = (refereeId: string | undefined, season: string) => {
	return useQuery({
		queryKey: ['seasonLeagueStats', refereeId, season],
		queryFn: getRefereeSeasonLeagueStats.bind(null, refereeId, season),
		enabled: !!refereeId
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
