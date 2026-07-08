import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerSplitRecords } from '@/types/api/Player';

export const usePlayerSplitRecords = (
	playerId: string,
	statKey: string,
	league: string | undefined,
	db: PlayerDB
) => {
	return useQuery({
		queryKey: ['player', 'split-records', playerId, statKey, league ?? 'all', db],
		queryFn: () => getPlayerSplitRecords(db, playerId, statKey, league),
		enabled: !!playerId && !!statKey,
		errorMessage: 'Failed to load records'
	});
};

const getPlayerSplitRecords = async (
	db: PlayerDB,
	playerId: string,
	statKey: string,
	league?: string
): Promise<PlayerSplitRecords> => {
	const res = await apiClient.get(API_ROUTES.player.stats.splitRecords(db, playerId, { statKey, league }));
	return res.data;
};
