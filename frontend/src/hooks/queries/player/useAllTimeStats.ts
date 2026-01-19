// hooks/useAllTimeStats.ts
import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerCareerStats } from '@/types/api/player';

export const useAllTimeStats = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['all-time', 'total-stats', playerId, db],
		queryFn: () => getAllTimeTotalStats(db, playerId),
		enabled: !!playerId && !!db,
		errorMessage: 'Failed to load all-time statistics'
	});
};

export const getAllTimeTotalStats = async (db: PlayerDB, playerId: string): Promise<PlayerCareerStats[]> => {
	const params = new URLSearchParams({
		playerId
	});
	const res = await apiClient.get(API_ROUTES.player.stats.allTime(db, params.toString()));

	return res.data;
};
