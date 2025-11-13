// hooks/useAllTimeStats.ts
import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerCareerStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAllTimeStats = (playerId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['all-time', 'total-stats', playerId, db],
		queryFn: () => getAllTimeTotalStats(db, playerId),
		enabled: !!playerId && !!db
	});
};

export const getAllTimeTotalStats = async (db: PlayerDB, playerId: string): Promise<PlayerCareerStats[]> => {
	const params = new URLSearchParams({
		playerId
	});
	const res = await axios.get(API_ROUTES.player.stats.allTime(db, params.toString()));
	console.log('DATA', res.data);

	return res.data;
};
