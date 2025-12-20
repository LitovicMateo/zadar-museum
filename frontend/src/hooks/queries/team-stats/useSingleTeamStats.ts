import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';

export const useSingleTeamStats = (game: string, team: string) => {
	return useQuery({
		queryKey: ['team-stats', game, team],
		queryFn: getSingleTeamStats.bind(null, game, team),
		enabled: !!game && !!team
	});
};

const getSingleTeamStats = async (game: string, team: string): Promise<TeamStatsResponse> => {
	const params = new URLSearchParams({
		game,
		team
	});
	const res = await apiClient.get(API_ROUTES.stats.team.game(params.toString()));

	return unwrapSingle<TeamStatsResponse>(res as unknown as { data?: unknown }) as TeamStatsResponse;
};
