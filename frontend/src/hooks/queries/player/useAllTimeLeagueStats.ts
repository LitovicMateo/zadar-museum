import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerCareerStats } from '@/types/api/player';

export const useAllTimeLeagueStats = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['all-time-stats', 'league', 'player', playerId, db],
		queryFn: () => getAllTimeTotalLeagueStats(db, playerId),
		enabled: !!playerId,
		errorMessage: 'Failed to load league statistics'
	});
};

const getAllTimeTotalLeagueStats = async (db: PlayerDB, playerId: string): Promise<PlayerCareerStats[]> => {
	const params = new URLSearchParams({
		playerId
	});

	const res = await apiClient.get(API_ROUTES.player.stats.league(db, params.toString()));

	return res.data;
};
