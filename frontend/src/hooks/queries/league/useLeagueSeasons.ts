import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useLeagueSeasons = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'seasons', leagueSlug],
		queryFn: getCompetitionSeasons.bind(null, leagueSlug),
		enabled: !!leagueSlug
	});
};

const getCompetitionSeasons = async (competitionSlug: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.league.seasons(competitionSlug));

	return res.data;
};
