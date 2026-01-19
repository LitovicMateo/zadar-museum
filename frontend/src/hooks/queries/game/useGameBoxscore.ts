import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerBoxscoreResponse } from '@/types/api/player';

export const useGameBoxscore = (gameId: string, teamSlug: string | undefined) => {
	return useQuery({
		queryKey: ['boxscore', gameId, teamSlug],
		queryFn: getGameBoxscore.bind(null, gameId, teamSlug!),
		enabled: !!gameId && !!teamSlug,
		errorMessage: 'Failed to load game boxscore'
	});
};

const getGameBoxscore = async (gameId: string, teamSlug: string): Promise<PlayerBoxscoreResponse[]> => {
	const res = await apiClient.get(API_ROUTES.game.boxscore(gameId, teamSlug));

	const raw = res.data;

	return raw;
};
