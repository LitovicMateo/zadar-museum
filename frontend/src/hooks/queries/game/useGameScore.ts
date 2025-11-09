import { API_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameScore = (gameId: string) => {
	return useQuery({
		queryKey: ['score', gameId],
		queryFn: getGameScore.bind(null, gameId),
		enabled: !!gameId
	});
};

const getGameScore = async (gameId: string): Promise<TeamScheduleResponse> => {
	const res = await axios.get(API_ROUTES.game.score(gameId));
	const raw = res.data;

	return raw[0];
};
