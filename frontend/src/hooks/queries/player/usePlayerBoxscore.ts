import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerBoxscore = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['boxscore', playerId, season], // stable key
		queryFn: getPlayerBoxscore.bind(null, playerId!, season),
		enabled: !!playerId
	});
};

const getPlayerBoxscore = async (playerId: string, season: string): Promise<PlayerBoxscoreResponse[]> => {
	const params = new URLSearchParams({
		playerId: playerId!,
		season
	});

	const res = await apiClient.get(API_ROUTES.player.stats.boxscore(params.toString()));

	return unwrapCollection<PlayerBoxscoreResponse>(res as unknown as { data?: unknown });
};
