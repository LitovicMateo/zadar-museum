import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { CompetitionDetailsResponse } from '@/types/api/competition';

export const useLeagueDetails = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', leagueSlug],
		queryFn: getCompetitionDetails.bind(null, leagueSlug),
		enabled: !!leagueSlug,
		errorMessage: 'Failed to load league details'
	});
};

const getCompetitionDetails = async (competitionSlug: string): Promise<CompetitionDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.league.details(competitionSlug));

	return res.data;
};
