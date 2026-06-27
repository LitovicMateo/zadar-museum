import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachCompareResponse } from '@/types/api/Coach';

export const useCoachCompareStats = (
	coach1Id: string,
	coach2Id: string,
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
) => {
	return useQuery({
		queryKey: ['coach-compare-stats', coach1Id, coach2Id, location, league, season],
		queryFn: getCoachCompareStats.bind(null, coach1Id, coach2Id, location, league, season),
		enabled: Boolean(coach1Id) && Boolean(coach2Id),
		errorMessage: 'Failed to load coach comparison'
	});
};

const getCoachCompareStats = async (
	coach1Id: string,
	coach2Id: string,
	location: 'home' | 'away' | 'all',
	league: string,
	season: string
): Promise<CoachCompareResponse> => {
	const params = new URLSearchParams({
		ids: `${coach1Id},${coach2Id}`,
		location,
		league,
		season
	});

	const res = await apiClient.get(API_ROUTES.stats.coach.compare(params.toString()));

	return res.data;
};
