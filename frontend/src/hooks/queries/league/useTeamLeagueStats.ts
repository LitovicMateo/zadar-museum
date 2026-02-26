import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamSeasonStatsResponse } from '@/types/api/team';

export const useTeamLeagueSeasonStats = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['team', 'league', 'stats', leagueSlug, season],
		queryFn: getSingleTeamLeagueStats.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load team league statistics'
	});
};

const getSingleTeamLeagueStats = async (leagueSlug: string, season: string): Promise<TeamSeasonStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.league.teamSeasonStats(leagueSlug, season));

	const data = res.data;

	return data;
};
