import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team-stats';

export const useSingleTeamStats = (game: string, team: string) => {
	return useQuery({
		queryKey: ['team-stats', game, team],
		queryFn: getSingleTeamStats.bind(null, game, team),
		enabled: !!game && !!team,
		errorMessage: 'Failed to load team statistics'
	});
};

const getSingleTeamStats = async (game: string, team: string): Promise<TeamStatsResponse> => {
	const params = new URLSearchParams({
		game,
		team
	});
	const res = await apiClient.get(API_ROUTES.stats.team.game(params.toString()));

	console.log(res.data[0]);
	
	return res.data[0];
};
