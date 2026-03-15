import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

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
