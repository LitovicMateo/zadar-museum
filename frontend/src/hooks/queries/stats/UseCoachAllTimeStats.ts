import { PlayerDB } from '@/components/Player/PlayerPage';
import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachStatsRanking } from '@/types/api/Coach';

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
		role,
		location,
		league,
		season
	});
	const res = await apiClient.get(API_ROUTES.stats.coach.allTime(params.toString()));

	return res.data;
};
