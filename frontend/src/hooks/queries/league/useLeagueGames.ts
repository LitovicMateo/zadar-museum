import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useLeagueGames = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['league', 'games', leagueSlug, season],
		queryFn: getCompetitionGamelog.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season
	});
};

const getCompetitionGamelog = async (competitionSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.league.gamelog(competitionSlug, season));

	return res.data;
};
