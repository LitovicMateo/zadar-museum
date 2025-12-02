import { API_ROUTES } from '@/constants/routes';
import { RefereeStatsRanking } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeAllTimeStats = (location: 'home' | 'away' | 'all', league: string, season: string) => {
	return useQuery({
		queryKey: ['referee-all-time-stats', location, league, season],
		queryFn: getRefereeAllTimeStats.bind(null, location, league, season)
	});
};

const getRefereeAllTimeStats = async (
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<RefereeStatsRanking[]> => {
	const params = new URLSearchParams({
		location: location !== 'all' ? location : '',
		league: league !== 'all' ? league : '',
		season: season !== 'all' ? season : ''
	});
	const res = await axios.get(API_ROUTES.stats.referee.allTime(params.toString()));

	return res.data;
};
