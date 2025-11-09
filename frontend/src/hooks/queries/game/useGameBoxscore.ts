import { API_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameBoxscore = (gameId: string, teamSlug: string | undefined) => {
	return useQuery({
		queryKey: ['boxscore', gameId, teamSlug],
		queryFn: getGameBoxscore.bind(null, gameId, teamSlug!),
		enabled: !!gameId && !!teamSlug
	});
};

const getGameBoxscore = async (gameId: string, teamSlug: string): Promise<PlayerBoxscoreResponse[]> => {
	const res = await axios.get(API_ROUTES.game.boxscore(gameId, teamSlug));

	const raw = res.data;

	return raw;
};
