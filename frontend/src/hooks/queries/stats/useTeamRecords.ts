import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamRecords = (
	database: PlayerDB,
	season: string,
	league: string,
	location: 'home' | 'away' | 'all',
	sortKey: string
) => {
	return useQuery({
		queryKey: ['team-records', database, season, league, location, sortKey],
		queryFn: getTeamRecords.bind(null, database, season, league, location, sortKey)
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
		season: season === 'all' ? '' : season,
		league: league === 'all' ? '' : league,
		location: location === 'all' ? '' : location,
		sortKey
	});
	const res = await axios.get(API_ROUTES.stats.team.records(params.toString()));

	return res.data;
};
