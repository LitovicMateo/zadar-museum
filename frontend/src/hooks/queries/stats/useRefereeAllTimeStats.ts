import { API_ROUTES } from '@/constants/routes';
import { RefereeStatsRanking } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeAllTimeStats = (
	location: 'home' | 'away' | null,
	league: string | null,
	season: string | null
) => {
	return useQuery({
		queryKey: ['referee-all-time-stats', location, league, season],
		queryFn: getRefereeAllTimeStats.bind(null, location, league, season)
	});
};

const getRefereeAllTimeStats = async (
	location: string | null,
	league: string | null,
	season: string | null
): Promise<RefereeStatsRanking[]> => {
	const params = new URLSearchParams({
		location: location || '',
		league: league || '',
		season: season || ''
	});
	const res = await axios.get(API_ROUTES.stats.referee.allTime(params.toString()));

	return res.data;
};
