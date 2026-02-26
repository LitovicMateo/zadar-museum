import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team';

export const useTeamSeasonLeagueStats = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['season-stats', season, teamSlug],
		queryFn: getTeamSeasonLeagueStats.bind(null, season, teamSlug),
		enabled: !!season && !!teamSlug,
		errorMessage: 'Failed to load season league statistics'
	});
};

const getTeamSeasonLeagueStats = async (season: string, teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.stats.seasonTotalStats(teamSlug!, season!));

	return res.data;
};
