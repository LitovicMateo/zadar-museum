import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { GameStatsEntry } from '@/types/api/player';

export const usePlayerSeasonLeagueAverage = (playerId: string, season: string, database: PlayerDB) => {
	return useQuery<GameStatsEntry[]>({
		queryKey: ['seasonLeagueAverage', playerId, season, database],
		queryFn: getPlayerSeasonLeagueAverage.bind(null, playerId!, season, database),
		enabled: !!playerId,
		errorMessage: 'Failed to load league averages'
	});
};

const getPlayerSeasonLeagueAverage = async (playerId: string, season: string, database: PlayerDB) => {
	const res = await apiClient.get(API_ROUTES.player.stats.seasonLeagueAverage(playerId!, season, database));

	return res.data;
};
