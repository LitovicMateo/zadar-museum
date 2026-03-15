import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { RefereeDetailsResponse } from '@/types/api/Referee';

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

	const refs = [game.mainReferee, game.secondReferee, game.thirdReferee].filter(Boolean) as RefereeDetailsResponse[];

	return refs;
};
