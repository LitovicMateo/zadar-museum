import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useRefereeSeasons = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'seasons', refereeId],
		queryFn: getRefereeSeasons.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeSeasons = async (refereeId: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.referee.seasons(refereeId));
	const data = res.data;

	return data;
};
