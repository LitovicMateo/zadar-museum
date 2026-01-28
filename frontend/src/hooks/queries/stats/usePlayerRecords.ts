import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerRecords } from '@/types/api/player-stats';

export const usePlayerRecords = (
	database: PlayerDB,
	season: string,
	league: string,
	location: 'home' | 'away' | 'all',
	sortKey: string
) => {
	return useQuery({
		queryKey: ['player-records', database, season, league, location, sortKey],
		queryFn: getPlayerRecords.bind(null, database, season, league, location, sortKey),
		errorMessage: 'Failed to load player records'
	});
};

const getPlayerRecords = async (
	database: PlayerDB,
	season: string,
	league: string,
	location: 'home' | 'away' | 'all',
	sortKey: string
): Promise<PlayerRecords[]> => {
	const params = new URLSearchParams({
		database,
		season: season === 'all' ? '' : season,
		league: league === 'all' ? '' : league,
		location: location === 'all' ? '' : location,
		sortKey
	});
	const res = await apiClient.get(API_ROUTES.stats.player.records(params.toString()));

	return res.data;
};
