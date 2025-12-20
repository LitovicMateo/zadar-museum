import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { TeamBoxscoreResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useGameTeamStats = (gameId: string) =>
	useQuery({
		queryKey: ['team-stats', gameId],
		queryFn: fetchSingleGameTeamBoxscore.bind(null, gameId!),
		enabled: !!gameId
	});

const fetchSingleGameTeamBoxscore = async (gameId: string): Promise<TeamBoxscoreResponse[]> => {
	const res = await apiClient.get(API_ROUTES.game.teamStats(gameId));

	return unwrapCollection<TeamBoxscoreResponse>(res as unknown as { data?: unknown });
};
