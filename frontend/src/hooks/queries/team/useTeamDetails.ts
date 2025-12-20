import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { TeamDetailsResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useTeamDetails = (teamSlug: string) => {
	return useQuery({
		queryKey: ['team', teamSlug],
		queryFn: getSingleTeam.bind(null, teamSlug),
		enabled: !!teamSlug
	});
};

const getSingleTeam = async (slug: string): Promise<TeamDetailsResponse> => {
	const res = await apiClient.get<{ data: TeamDetailsResponse[] }>(API_ROUTES.team.details(slug));
	const raw = unwrapSingle<TeamDetailsResponse>(res);
	return raw as TeamDetailsResponse;
};
