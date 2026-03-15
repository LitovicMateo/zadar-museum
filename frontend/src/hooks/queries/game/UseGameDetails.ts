import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { GameDetailsResponse } from '@/types/api/Game';

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
