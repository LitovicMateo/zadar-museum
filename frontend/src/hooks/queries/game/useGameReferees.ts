import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereeDetailsResponse } from '@/types/api/referee';

export const useGameReferees = (gameId: string) => {
	return useQuery({
		queryKey: ['game', 'referees', gameId],
		queryFn: getGameReferees.bind(null, gameId!),
		enabled: !!gameId,
		errorMessage: 'Failed to load game referees'
	});
};

const getGameReferees = async (gameId: string): Promise<RefereeDetailsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.game.details(gameId));
	const game = res.data;

	if (!game.mainReferee || !game.secondReferee || !game.thirdReferee) return [];

	const refs = [game.mainReferee, game.secondReferee, game.thirdReferee];

	return refs;
};
