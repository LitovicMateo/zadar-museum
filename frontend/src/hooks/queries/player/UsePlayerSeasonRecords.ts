import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerSeasonRecords } from '@/types/api/Player';

export const usePlayerSeasonRecords = (playerId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['player', 'season-records', playerId, season, db],
		queryFn: () => getPlayerSeasonRecords(db, playerId, season),
		enabled: !!playerId && !!season,
		errorMessage: 'Failed to load season records'
	});
};

const getPlayerSeasonRecords = async (
	db: PlayerDB,
	playerId: string,
	season: string
): Promise<PlayerSeasonRecords> => {
	const res = await apiClient.get(API_ROUTES.player.stats.seasonRecords(db, playerId, season));
	return res.data;
};
