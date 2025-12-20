import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { TeamStatsRanking } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamAllTimeStats = (location: 'home' | 'away' | 'all', league: string, season: string) => {
	return useQuery({
		queryKey: ['team-all-time-stats', location, league, season],
		queryFn: getTeamAllTimeStats.bind(null, location, league, season)
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

	return unwrapCollection<TeamStatsRanking>(res as unknown as { data?: unknown });
};
