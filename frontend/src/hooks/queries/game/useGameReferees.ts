import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { GameDetailsResponse } from '@/types/api/game';
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
	const game = res.data;

	if (!game.mainReferee || !game.secondReferee || !game.thirdReferee) return [];

	const refs = [game.mainReferee, game.secondReferee, game.thirdReferee];

	return refs;
};
