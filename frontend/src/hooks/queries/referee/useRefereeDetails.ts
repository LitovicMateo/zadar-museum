import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { RefereeDetailsResponse } from '@/types/api/referee';

export const useRefereeDetails = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', refereeId],
		queryFn: getRefereeDetails.bind(null, refereeId),
		enabled: !!refereeId,
		errorMessage: 'Failed to load referee details'
	});
};

const getRefereeDetails = async (refereeId: string): Promise<RefereeDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.referee.details(refereeId));
	const data = res.data.data;

	return data;
};
