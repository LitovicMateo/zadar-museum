import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { CoachDetailsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useCoachDetails = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', coachId],
		queryFn: getCoachDetails.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachDetails = async (coachId: string): Promise<CoachDetailsResponse> => {
	const res = await apiClient.get<CoachDetailsResponse>(API_ROUTES.coach.details(coachId));

	return unwrapSingle<CoachDetailsResponse>(res as unknown as { data?: unknown }) as CoachDetailsResponse;
};
