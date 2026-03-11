import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerBoxscoreResponse } from '@/types/api/Player';

export const usePlayerBoxscore = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['boxscore', playerId, season], // stable key
		queryFn: getPlayerBoxscore.bind(null, playerId!, season),
		enabled: !!playerId,
		errorMessage: 'Failed to load player boxscore'
	});
};

const getPlayerBoxscore = async (playerId: string, season: string): Promise<PlayerBoxscoreResponse[]> => {
	const params = new URLSearchParams({
		playerId: playerId!,
		season
	});

	const res = await apiClient.get(API_ROUTES.player.stats.boxscore(params.toString()));

	return res.data as PlayerBoxscoreResponse[];
};
