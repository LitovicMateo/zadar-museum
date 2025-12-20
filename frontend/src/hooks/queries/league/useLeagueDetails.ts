import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { CompetitionDetailsResponse } from '@/types/api/competition';
import { useQuery } from '@tanstack/react-query';

export const useLeagueDetails = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', leagueSlug],
		queryFn: getCompetitionDetails.bind(null, leagueSlug),
		enabled: !!leagueSlug
	});
};

const getCompetitionDetails = async (competitionSlug: string): Promise<CompetitionDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.league.details(competitionSlug));

	return res.data;
};
