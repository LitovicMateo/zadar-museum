import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useCoachSeasonCompetitions = (coachId: string, season: string) => {
	return useQuery({
		queryKey: ['coach', 'season', 'competition', coachId, season],
		queryFn: getCoachSeasonCompetitions.bind(null, coachId, season),
		enabled: !!coachId && !!season
	});
};

type Competition = {
	league_id: string;
	league_name: string;
	competition_slug: string;
};

const getCoachSeasonCompetitions = async (coachId: string, season: string): Promise<Competition[]> => {
	const res = await apiClient.get<Competition[]>(API_ROUTES.coach.competitions(coachId, season));

	return unwrapCollection<Competition>(res as unknown as { data?: unknown });
};
