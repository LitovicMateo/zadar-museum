import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsRanking } from '@/types/api/coach';

export const useCoachAllTimeStats = (
	database: PlayerDB,
	role: 'all' | 'head' | 'assistant',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
) => {
	return useQuery({
		queryKey: ['coach-all-time-stats', database, role, location, league, season],
		queryFn: getCoachAllTimeStats.bind(null, database, role, location, league, season),
		errorMessage: 'Failed to load coach statistics'
	});
};

const getCoachAllTimeStats = async (
	database: PlayerDB,
	role: 'all' | 'head' | 'assistant',
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<{
	current: CoachStatsRanking[];
	previous: CoachStatsRanking[];
}> => {
	const params = new URLSearchParams({
		database,
		role: role === 'all' ? '' : role,
		location: location === 'all' ? '' : location,
		league: league === 'all' ? '' : league,
		season: season === 'all' ? '' : season
	});
	const res = await apiClient.get(API_ROUTES.stats.coach.allTime(params.toString()));

	return res.data;
};
