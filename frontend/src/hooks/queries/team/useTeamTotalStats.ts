import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { TeamStatsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamTotalStats = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', 'head2head', teamSlug],
		queryFn: getTeamTotalStats.bind(null, teamSlug!),
		enabled: !!teamSlug
	});
};

const getTeamTotalStats = async (teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.stats.total(teamSlug));

	return unwrapSingle<TeamStatsResponse>(res as unknown as { data?: unknown }) as TeamStatsResponse;
};
