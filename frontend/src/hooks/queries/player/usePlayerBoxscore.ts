import { API_ROUTES } from '@/constants/routes';
import { PlayerBoxscoreResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerBoxscore = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['boxscore', playerId, season], // stable key
		queryFn: getPlayerBoxscore.bind(null, playerId!, season),
		enabled: !!playerId
	});
};

const getPlayerBoxscore = async (playerId: string, season: string): Promise<PlayerBoxscoreResponse[]> => {
	const params = new URLSearchParams({
		playerId: playerId!,
		season
	});

	const res = await axios.get(API_ROUTES.player.stats.boxscore(params.toString()));

	return res.data as PlayerBoxscoreResponse[];
};
