import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachDetailsResponse } from '@/types/api/Coach';

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
