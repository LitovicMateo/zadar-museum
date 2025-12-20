import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useLeagueSeasons = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'seasons', leagueSlug],
		queryFn: getCompetitionSeasons.bind(null, leagueSlug),
		enabled: !!leagueSlug
	});
};

const getCompetitionSeasons = async (competitionSlug: string): Promise<string[]> => {
	const res = await apiClient.get<string[]>(API_ROUTES.league.seasons(competitionSlug));

	return unwrapCollection<string>(res as unknown as { data?: unknown });
};
