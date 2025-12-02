import { API_ROUTES } from '@/constants/routes';
import { TeamStatsRanking } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTeamAllTimeStats = (location: 'home' | 'away' | 'all', league: string, season: string) => {
	return useQuery({
		queryKey: ['team-all-time-stats', location, league, season],
		queryFn: getTeamAllTimeStats.bind(null, location, league, season)
	});
};

const getTeamAllTimeStats = async (
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<TeamStatsRanking[]> => {
	const params = new URLSearchParams({
		location: location === 'all' ? '' : location,
		league: league === 'all' ? '' : league,
		season: season === 'all' ? '' : season
	});
	const res = await axios.get(API_ROUTES.stats.team.allTime(params.toString()));

	return res.data;
};
