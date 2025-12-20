import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { PlayerCareerStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const useAllTimeLeagueStats = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['all-time-stats', 'league', 'player', playerId, db],
		queryFn: () => getAllTimeTotalLeagueStats(db, playerId),
		enabled: !!playerId
	});
};

const getAllTimeTotalLeagueStats = async (db: PlayerDB, playerId: string): Promise<PlayerCareerStats[]> => {
	const params = new URLSearchParams({
		playerId
	});

	const res = await apiClient.get(API_ROUTES.player.stats.league(db, params.toString()));

	return res.data;
};
