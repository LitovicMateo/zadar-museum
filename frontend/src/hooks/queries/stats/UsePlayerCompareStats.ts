import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerCompareResponse } from '@/types/api/Player';

export const usePlayerCompareStats = (
	player1Id: string,
	player2Id: string,
	stats: 'total' | 'average',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
) => {
	return useQuery({
		queryKey: ['player-compare-stats', player1Id, player2Id, stats, location, league, season],
		queryFn: getPlayerCompareStats.bind(null, player1Id, player2Id, stats, location, league, season),
		enabled: Boolean(player1Id) && Boolean(player2Id),
		errorMessage: 'Failed to load player comparison'
	});
};

const getPlayerCompareStats = async (
	player1Id: string,
	player2Id: string,
	stats: 'total' | 'average',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<PlayerCompareResponse> => {
	const params = new URLSearchParams({
		ids: `${player1Id},${player2Id}`,
		stats,
		location,
		league,
		season
	});

	const res = await apiClient.get(API_ROUTES.stats.player.compare(params.toString()));

	return res.data;
};
