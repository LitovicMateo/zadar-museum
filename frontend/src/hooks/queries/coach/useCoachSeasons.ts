import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useCoachSeasons = (coachId: string) => {
	return useQuery({
		queryKey: ['coach', 'seasons', coachId],
		queryFn: getCoachSeasons.bind(null, coachId),
		enabled: !!coachId
	});
};

const getCoachSeasons = async (coachId: string): Promise<string[]> => {
	const res = await apiClient.get<string[]>(API_ROUTES.coach.seasons(coachId!));
	const data = unwrapCollection<string>(res as unknown as { data?: unknown });

	const seasonArr = data
		.map((s: { season: string } | string) => (typeof s === 'string' ? s : s.season))
		.sort((a: string, b: string) => +b - +a);

	return seasonArr;
};
