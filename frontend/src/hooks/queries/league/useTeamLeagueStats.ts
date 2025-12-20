import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamSeasonStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamLeagueSeasonStats = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['team', 'league', 'stats', leagueSlug, season],
		queryFn: getSingleTeamLeagueStats.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season
	});
};

const getSingleTeamLeagueStats = async (leagueSlug: string, season: string): Promise<TeamSeasonStatsResponse[]> => {
	const res = await apiClient.get<TeamSeasonStatsResponse[]>(API_ROUTES.league.teamSeasonStats(leagueSlug, season));

	const data = res.data ?? [];

	return data;
};
