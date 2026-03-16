import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { GameStatsEntry } from '@/types/api/Player';

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
