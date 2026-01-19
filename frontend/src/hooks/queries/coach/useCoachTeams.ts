import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerTeamResponse } from '@/types/api/player';

export const useCoachTeams = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'teams', coachId],
		queryFn: getCoachTeams.bind(null, coachId),
		enabled: !!coachId,
		errorMessage: 'Failed to load coach teams'
	});
};

const getCoachTeams = async (coachId: string): Promise<PlayerTeamResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.teams(coachId));

	return res.data;
};
