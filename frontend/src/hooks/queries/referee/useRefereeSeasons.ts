import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useRefereeSeasons = (refereeId: string) => {
	return useQuery({
		queryKey: ['referee', 'seasons', refereeId],
		queryFn: getRefereeSeasons.bind(null, refereeId),
		enabled: !!refereeId
	});
};

const getRefereeSeasons = async (refereeId: string): Promise<string[]> => {
	const res = await axios.get(API_ROUTES.referee.seasons(refereeId));
	const data = res.data;

	return data;
};
