import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useLeagueSeasons = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'seasons', leagueSlug],
		queryFn: getCompetitionSeasons.bind(null, leagueSlug),
		enabled: !!leagueSlug
	});
};

const getCompetitionSeasons = async (competitionSlug: string): Promise<string[]> => {
	const res = await axios.get(API_ROUTES.league.seasons(competitionSlug));

	return res.data;
};
