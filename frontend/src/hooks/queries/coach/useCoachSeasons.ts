import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useCoachSeasons = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'seasons', coachId],
		queryFn: getCoachSeasons.bind(null, coachId),
		enabled: !!coachId,
		errorMessage: 'Failed to load coach seasons'
	});
};

const getCoachSeasons = async (coachId: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.coach.seasons(coachId!));
	const data = res.data;

	const seasonArr = data.map((s: { season: string }) => s.season).sort((a: string, b: string) => +b - +a);

	return seasonArr;
};
