import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamBoxscoreResponse } from '@/types/api/Team';

export const useGameTeamStats = (gameId: string) =>
	useQuery({
		queryKey: ['team-stats', gameId],
		queryFn: fetchSingleGameTeamBoxscore.bind(null, gameId!),
		enabled: !!gameId,
		errorMessage: 'Failed to load team statistics'
	});

const fetchSingleGameTeamBoxscore = async (gameId: string): Promise<TeamBoxscoreResponse[]> => {
	const res = await apiClient.get(API_ROUTES.game.teamStats(gameId));

	return res.data as TeamBoxscoreResponse[];
};
