import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { PlayerCareerHighResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerCareerHigh = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['player', 'career-high', playerId, db],
		queryFn: getPlayerCareerHigh.bind(null, playerId, db)
	});
};

const getPlayerCareerHigh = async (playerId: string, db: PlayerDB): Promise<PlayerCareerHighResponse> => {
	const res = await apiClient.get(API_ROUTES.player.stats.careerHigh(playerId!, db));
	const data = res.data;

	return data;
};
