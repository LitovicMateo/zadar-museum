import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

export const useLeagueGames = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['league', 'games', leagueSlug, season],
		queryFn: getCompetitionGamelog.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load league games'
	});
};

const getCompetitionGamelog = async (competitionSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.league.gamelog(competitionSlug, season));

	return res.data;
};
