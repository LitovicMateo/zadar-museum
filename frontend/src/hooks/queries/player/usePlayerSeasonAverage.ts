import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { GameStatsEntry } from '@/types/api/player';

export const usePlayerSeasonAverage = (playerId: string, season: string, database: PlayerDB) => {
	return useQuery<GameStatsEntry[]>({
		queryKey: ['seasonAverage', playerId, season, database],
		queryFn: getPlayerSeasonAverage.bind(null, playerId!, season, database),
		enabled: !!playerId,
		errorMessage: 'Failed to load season averages'
	});
};

const getPlayerSeasonAverage = async (playerId: string, season: string, database: PlayerDB) => {
	const res = await apiClient.get(API_ROUTES.player.stats.seasonAverage(playerId!, season, database));

	return res.data;
};
