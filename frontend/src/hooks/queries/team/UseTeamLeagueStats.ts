import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsResponse } from '@/types/api/Team';

export const useTeamLeagueStats = (teamId: string) => {
	return useQuery({
		queryKey: ['team-league-stats', 'league', teamId],
		queryFn: getTeamLeagueStats.bind(null, teamId),
		enabled: !!teamId,
		errorMessage: 'Failed to load team league statistics'
	});
};

const getTeamLeagueStats = async (teamId: string): Promise<TeamStatsResponse[]> => {
	const data = await apiClient.get(API_ROUTES.team.stats.leagueStats(teamId));

	return data.data;
};
