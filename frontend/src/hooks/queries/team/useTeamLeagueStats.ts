import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team';

export const useTeamLeagueStats = (teamId: string) => {
	return useQuery({
		queryKey: ['team-league-stats', 'league', teamId],
		queryFn: getTeamLeagueStats.bind(null, teamId),
		enabled: !!teamId,
		errorMessage: 'Failed to load team league statistics'
	});
};

const getTeamLeagueStats = async (teamId: string): Promise<TeamStatsResponse[]> => {
	const data = await axios.get(API_ROUTES.team.stats.leagueStats(teamId));

	return data.data;
};
