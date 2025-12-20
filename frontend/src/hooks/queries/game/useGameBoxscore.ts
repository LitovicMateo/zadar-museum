import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const useGameBoxscore = (gameId: string, teamSlug: string | undefined) => {
	return useQuery({
		queryKey: ['boxscore', gameId, teamSlug],
		queryFn: getGameBoxscore.bind(null, gameId, teamSlug!),
		enabled: !!gameId && !!teamSlug
	});
};

const getGameBoxscore = async (gameId: string, teamSlug: string): Promise<PlayerBoxscoreResponse[]> => {
	const res = await apiClient.get(API_ROUTES.game.boxscore(gameId, teamSlug));
	return res.data as PlayerBoxscoreResponse[];
};
