import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerTeamResponse } from '@/types/api/Player';

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
