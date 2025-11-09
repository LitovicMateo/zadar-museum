import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoachSeasons = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'seasons', coachId],
		queryFn: getCoachSeasons.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachSeasons = async (coachId: string): Promise<string[]> => {
	const res = await axios.get(API_ROUTES.coach.seasons(coachId!));
	const data = res.data;

	const seasonArr = data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);

	return seasonArr;
};
