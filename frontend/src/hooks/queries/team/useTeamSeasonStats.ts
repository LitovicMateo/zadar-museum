import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team';

export const useTeamSeasonStats = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['season-league-stats', season, teamSlug],
		queryFn: getTeamSeasonStats.bind(null, season, teamSlug),
		enabled: !!season && !!teamSlug,
		errorMessage: 'Failed to load season statistics'
	});
};

const getTeamSeasonStats = async (season: string, teamSlug: string): Promise<TeamStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.team.stats.seasonLeagueStats(teamSlug!, season!));

	return res.data;
};
