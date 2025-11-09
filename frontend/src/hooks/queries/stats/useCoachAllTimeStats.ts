import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsRanking } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachAllTimeStats = (
	database: PlayerDB,
	role: null | 'head' | 'assistant',
	location: 'home' | 'away' | null,
	league: string | null,
	season: string | null
) => {
	return useQuery({
		queryKey: ['coach-all-time-stats', database, role, location, league, season],
		queryFn: getCoachAllTimeStats.bind(null, database, role, location, league, season)
	});
};

const getCoachAllTimeStats = async (
	database: PlayerDB,
	role: null | 'head' | 'assistant',
	location: 'home' | 'away' | null,
	league: string | null,
	season: string | null
): Promise<{
	current: CoachStatsRanking[];
	previous: CoachStatsRanking[];
}> => {
	const params = new URLSearchParams({
		database,
		role: role || '',
		location: location || '',
		league: league || '',
		season: season || ''
	});
	const res = await axios.get(API_ROUTES.stats.coach.allTime(params.toString()));

	return res.data;
};
