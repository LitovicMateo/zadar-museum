import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { GameStatsEntry } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerSeasonLeagueAverage = (playerId: string, season: string, database: PlayerDB) => {
	return useQuery<GameStatsEntry[]>({
		queryKey: ['seasonLeagueAverage', playerId, season, database],
		queryFn: getPlayerSeasonLeagueAverage.bind(null, playerId!, season, database),
		enabled: !!playerId
	});
};

const getPlayerSeasonLeagueAverage = async (playerId: string, season: string, database: PlayerDB) => {
	const res = await apiClient.get(API_ROUTES.player.stats.seasonLeagueAverage(playerId!, season, database));

	return res.data;
};
