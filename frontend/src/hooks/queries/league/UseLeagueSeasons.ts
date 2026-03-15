import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';

export const useLeagueSeasons = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'seasons', leagueSlug],
		queryFn: getCompetitionSeasons.bind(null, leagueSlug),
		enabled: !!leagueSlug,
		errorMessage: 'Failed to load league seasons'
	});
};

const getCompetitionSeasons = async (competitionSlug: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.league.seasons(competitionSlug));

	return res.data;
};
