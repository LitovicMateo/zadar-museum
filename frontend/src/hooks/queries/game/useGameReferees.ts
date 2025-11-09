import { API_ROUTES } from '@/constants/routes';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameReferees = (gameId: string) => {
	return useQuery({
		queryKey: ['game', 'referees', gameId],
		queryFn: getGameReferees.bind(null, gameId!),
		enabled: !!gameId
	});
};

const getGameReferees = async (gameId: string): Promise<RefereeDetailsResponse[]> => {
	const res = await axios.get(API_ROUTES.game.details(gameId));
	const game = res.data;

	if (!game.mainReferee || !game.secondReferee || !game.thirdReferee) return [];

	const refs = [game.mainReferee, game.secondReferee, game.thirdReferee];

	return refs;
};
