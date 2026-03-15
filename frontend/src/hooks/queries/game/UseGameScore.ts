import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

export const useGameScore = (gameId: string) => {
	return useQuery({
		queryKey: ['score', gameId],
		queryFn: getGameScore.bind(null, gameId),
		enabled: !!gameId,
		errorMessage: 'Failed to load game score'
	});
};

const getGameScore = async (gameId: string): Promise<TeamScheduleResponse> => {
	const res = await apiClient.get(API_ROUTES.game.score(gameId));
	const raw = res.data;

	return raw[0];
};
