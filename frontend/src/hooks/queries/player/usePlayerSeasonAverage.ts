import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { GameStatsEntry } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerSeasonAverage = (playerId: string, season: string, database: PlayerDB) => {
	return useQuery<GameStatsEntry[]>({
		queryKey: ['seasonAverage', playerId, season, database],
		queryFn: getPlayerSeasonAverage.bind(null, playerId!, season, database),
		enabled: !!playerId
	});
};

const getPlayerSeasonAverage = async (playerId: string, season: string, database: PlayerDB) => {
	const res = await apiClient.get(API_ROUTES.player.stats.seasonAverage(playerId!, season, database));

	return res.data;
};
