import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerAllTimeStats = (
	database: PlayerDB,
	stats: 'total' | 'average',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
) => {
	return useQuery({
		queryKey: ['player-all-time-stats', database, stats, location, league, season],
		queryFn: getPlayerAllTimeStats.bind(null, database, stats, location, league, season)
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
		location: location === 'all' ? '' : location,
		league: league === 'all' ? '' : league,
		season: season === 'all' ? '' : season
	});

	const res = await axios.get(API_ROUTES.stats.player.allTime(params.toString()));

	return res.data;
};
