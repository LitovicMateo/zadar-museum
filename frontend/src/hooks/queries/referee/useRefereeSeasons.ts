import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useRefereeSeasons = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'seasons', refereeId],
		queryFn: getRefereeSeasons.bind(null, refereeId),
		enabled: !!refereeId,
		errorMessage: 'Failed to load referee seasons'
	});
};

const getRefereeSeasons = async (refereeId: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasons(refereeId));
	const data = res.data;

	return data;
};
