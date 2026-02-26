import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerAllTimeStats } from '@/types/api/player';

export const usePlayerAllTimeStats = (
	database: PlayerDB,
	stats: 'total' | 'average',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
) => {
	return useQuery({
		queryKey: ['player-all-time-stats', database, stats, location, league, season],
		queryFn: getPlayerAllTimeStats.bind(null, database, stats, location, league, season),
		errorMessage: 'Failed to load player statistics'
	});
};

const getPlayerAllTimeStats = async (
	database: PlayerDB,
	stats: 'total' | 'average',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<{
	current: PlayerAllTimeStats[];
	previous: PlayerAllTimeStats[];
}> => {
	const params = new URLSearchParams({
		database,
		stats,
		location,
		league,
		season
	});

	const res = await apiClient.get(API_ROUTES.stats.player.allTime(params.toString()));

	return res.data;
};
