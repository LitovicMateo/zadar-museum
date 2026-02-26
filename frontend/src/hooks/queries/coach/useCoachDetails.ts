import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { CoachDetailsResponse } from '@/types/api/coach';

export const useCoachDetails = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', coachId],
		queryFn: getCoachDetails.bind(null, coachId),
		enabled: !!coachId,
		errorMessage: 'Failed to load coach details'
	});
};

const getCoachDetails = async (coachId: string): Promise<CoachDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.coach.details(coachId));

	return res.data;
};
