import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsResponse } from '@/types/api/Team';

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
