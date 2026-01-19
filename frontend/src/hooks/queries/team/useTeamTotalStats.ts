import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamStatsResponse } from '@/types/api/team';

export const useTeamTotalStats = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', 'head2head', teamSlug],
		queryFn: getTeamTotalStats.bind(null, teamSlug!),
		enabled: !!teamSlug,
		errorMessage: 'Failed to load team statistics'
	});
};

const getTeamTotalStats = async (teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.stats.total(teamSlug));

	return res.data;
};
