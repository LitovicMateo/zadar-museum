import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsRanking } from '@/types/api/Team';

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
		location,
		league,
		season
	});
	const res = await apiClient.get(API_ROUTES.stats.team.allTime(params.toString()));

	return res.data;
};
