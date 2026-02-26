import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';

export const useTeamRecords = (
	database: PlayerDB,
	season: string,
	league: string,
	location: 'home' | 'away' | 'all',
	sortKey: string
) => {
	return useQuery({
		queryKey: ['team-records', database, season, league, location, sortKey],
		queryFn: getTeamRecords.bind(null, database, season, league, location, sortKey),
		errorMessage: 'Failed to load team records'
	});
};

const getTeamRecords = async (
	database: PlayerDB,
	season: string,
	league: string,
	location: 'home' | 'away' | 'all',
	sortKey: string
): Promise<TeamRecord[]> => {
	const params = new URLSearchParams({
		database,
		season,
		league,
		location,
		sortKey
	});
	const res = await apiClient.get(API_ROUTES.stats.team.records(params.toString()));

	return res.data;
};
