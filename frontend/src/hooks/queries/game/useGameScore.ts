import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useGameScore = (gameId: string) => {
	return useQuery({
		queryKey: ['score', gameId],
		queryFn: getGameScore.bind(null, gameId),
		enabled: !!gameId
	});
};

const getGameScore = async (gameId: string): Promise<TeamScheduleResponse> => {
	const res = await apiClient.get(API_ROUTES.game.score(gameId));
	return unwrapSingle<TeamScheduleResponse>(res as unknown as { data?: unknown }) as TeamScheduleResponse;
};
