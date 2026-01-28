import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamDetailsResponse } from '@/types/api/team';

export const useTeamDetails = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', teamSlug],
		queryFn: getSingleTeam.bind(null, teamSlug),
		enabled: !!teamSlug,
		errorMessage: 'Failed to load team details'
	});
};

const getSingleTeam = async (slug: string): Promise<TeamDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.team.details(slug));

	const raw = res.data.data[0];
	return raw;
};
