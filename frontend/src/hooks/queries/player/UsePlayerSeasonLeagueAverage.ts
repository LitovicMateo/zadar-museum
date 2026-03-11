import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerDB } from '@/pages/Player/Player';
import { GameStatsEntry } from '@/types/api/Player';

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
