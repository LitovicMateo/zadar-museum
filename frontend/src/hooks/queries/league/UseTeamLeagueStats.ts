import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamSeasonStatsResponse } from '@/types/api/Team';

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
