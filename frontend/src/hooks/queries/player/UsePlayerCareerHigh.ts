import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerCareerHighResponse } from '@/types/api/Player';

export const usePlayerCareerHigh = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['player', 'career-high', playerId, db],
		queryFn: getPlayerCareerHigh.bind(null, playerId, db),
		errorMessage: 'Failed to load career highs'
	});
};

const getPlayerCareerHigh = async (playerId: string, db: PlayerDB): Promise<PlayerCareerHighResponse> => {
	const res = await apiClient.get(API_ROUTES.player.stats.careerHigh(playerId!, db));
	const data = res.data;

	return data;
};
