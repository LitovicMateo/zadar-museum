import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team-stats';

export const useTeamStats = (key: keyof TeamStatsResponse, sort: 'asc' | 'desc') => {
	return useQuery({
		queryKey: ['team-stats', key, sort],
		queryFn: getTeamStats.bind(null, key, sort),
		errorMessage: 'Failed to load team statistics'
	});
};

const getTeamStats = async (key: keyof TeamStatsResponse, sort: 'asc' | 'desc'): Promise<TeamStatsResponse[]> => {
	const params = new URLSearchParams({
		sort: key.toString(),
		direction: sort
	});

	const res = await apiClient.get(API_ROUTES.dashboard.teamStats(params.toString()));

	return res.data;
};
