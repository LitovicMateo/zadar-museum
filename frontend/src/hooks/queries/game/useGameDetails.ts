import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { GameDetailsResponse } from '@/types/api/game';

export const useGameDetails = (gameId: string) => {
	return useQuery({
		queryKey: ['game', gameId],
		queryFn: getGameDetails.bind(null, gameId),
		enabled: !!gameId,
		errorMessage: 'Failed to load game details'
	});
};

const getGameDetails = async (id: string): Promise<GameDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.game.details(id));

	const raw = res.data;
	return raw as GameDetailsResponse;
};
