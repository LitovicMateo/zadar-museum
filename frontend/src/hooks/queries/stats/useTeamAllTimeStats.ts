import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsRanking } from '@/types/api/team';

export const useTeamAllTimeStats = (location: 'home' | 'away' | 'all', league: string, season: string) => {
	return useQuery({
		queryKey: ['team-all-time-stats', location, league, season],
		queryFn: getTeamAllTimeStats.bind(null, location, league, season),
		errorMessage: 'Failed to load team statistics'
	});
};

const getTeamAllTimeStats = async (
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<TeamStatsRanking[]> => {
	const params = new URLSearchParams({
		location: location === 'all' ? '' : location,
		league: league === 'all' ? '' : league,
		season: season === 'all' ? '' : season
	});
	const res = await apiClient.get(API_ROUTES.stats.team.allTime(params.toString()));

	return res.data;
};
