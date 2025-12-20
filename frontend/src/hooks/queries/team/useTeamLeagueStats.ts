import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamLeagueStats = (teamId: string) => {
	return useQuery({
		queryKey: ['team-league-stats', 'league', teamId],
		queryFn: getTeamLeagueStats.bind(null, teamId),
		enabled: !!teamId
	});
};

const getTeamLeagueStats = async (teamId: string): Promise<TeamStatsResponse[]> => {
	const data = await apiClient.get(API_ROUTES.team.stats.leagueStats(teamId));

	return data.data;
};
