import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerTeamResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const useCoachTeams = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'teams', coachId],
		queryFn: getCoachTeams.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachTeams = async (coachId: string): Promise<PlayerTeamResponse[]> => {
	const res = await apiClient.get<import('@/types/api/player').PlayerTeamResponse[]>(API_ROUTES.coach.teams(coachId));

	return unwrapCollection<import('@/types/api/player').PlayerTeamResponse>(res as unknown as { data?: unknown });
};
