import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereeStatsRanking } from '@/types/api/referee';

export const useRefereeAllTimeStats = (location: 'home' | 'away' | 'all', league: string, season: string) => {
	return useQuery({
		queryKey: ['referee-all-time-stats', location, league, season],
		queryFn: getRefereeAllTimeStats.bind(null, location, league, season),
		errorMessage: 'Failed to load referee statistics'
	});
};

const getRefereeAllTimeStats = async (
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<RefereeStatsRanking[]> => {
	const params = new URLSearchParams({
		location: location !== 'all' ? location : '',
		league: league !== 'all' ? league : '',
		season: season !== 'all' ? season : ''
	});
	const res = await apiClient.get(API_ROUTES.stats.referee.allTime(params.toString()));

	return res.data;
};
