import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { GameDetailsResponse } from '@/types/api/game';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';

export const useGameReferees = (gameId: string) => {
	return useQuery({
		queryKey: ['game', 'referees', gameId],
		queryFn: getGameReferees.bind(null, gameId!),
		enabled: !!gameId
	});
};

const getGameReferees = async (gameId: string): Promise<RefereeDetailsResponse[]> => {
	const res = await apiClient.get<GameDetailsResponse>(API_ROUTES.game.details(gameId));
	const game = unwrapSingle<GameDetailsResponse>(res as unknown as { data?: unknown });

	if (!game) return [];
	if (!game.mainReferee || !game.secondReferee || !game.thirdReferee) return [];

	return [game.mainReferee, game.secondReferee, game.thirdReferee];
};
