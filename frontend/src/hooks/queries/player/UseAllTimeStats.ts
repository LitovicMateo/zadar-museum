// hooks/useAllTimeStats.ts
import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerCareerStats } from '@/types/api/Player';

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
