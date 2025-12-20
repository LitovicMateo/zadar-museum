import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';

export const useRefereeDetails = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', refereeId],
		queryFn: getRefereeDetails.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeDetails = async (refereeId: string): Promise<RefereeDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.referee.details(refereeId));
	return unwrapSingle<RefereeDetailsResponse>(res as unknown as { data?: unknown }) as RefereeDetailsResponse;
};
