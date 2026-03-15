import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';

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
