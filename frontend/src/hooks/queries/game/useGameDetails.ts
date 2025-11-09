import { API_ROUTES } from '@/constants/routes';
import { GameDetailsResponse } from '@/types/api/game';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameDetails = (gameId: string) => {
	return useQuery({
		queryKey: ['game', gameId],
		queryFn: getGameDetails.bind(null, gameId),
		enabled: !!gameId
	});
};

const getGameDetails = async (id: string): Promise<GameDetailsResponse> => {
	const res = await axios.get(API_ROUTES.game.details(id));

	const raw = res.data;
	return raw as GameDetailsResponse;
};
