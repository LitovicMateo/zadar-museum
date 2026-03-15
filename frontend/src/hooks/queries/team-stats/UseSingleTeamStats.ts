import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsResponse } from '@/types/api/TeamStats';

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

	return res.data[0];
};
