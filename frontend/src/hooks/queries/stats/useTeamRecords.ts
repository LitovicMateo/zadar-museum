import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { TeamRecord } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamRecords = (
	database: PlayerDB,
	season: string | null,
	league: string | null,
	location: 'home' | 'away' | null,
	sortKey: string
) => {
	return useQuery({
		queryKey: ['team-records', database, season, league, location, sortKey],
		queryFn: getTeamRecords.bind(null, database, season, league, location, sortKey)
	});
};

const getTeamRecords = async (
	database: PlayerDB,
	season: string | null,
	league: string | null,
	location: 'home' | 'away' | null,
	sortKey: string
): Promise<TeamRecord[]> => {
	const params = new URLSearchParams({
		database,
		season: season || '',
		league: league || '',
		location: location || '',
		sortKey
	});
	const res = await axios.get(API_ROUTES.stats.team.records(params.toString()));

	return res.data;
};
