import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachStatsRanking } from '@/types/api/Coach';

export const useLeagueCoachRankings = (leagueSlug: string, stat: string) => {
	return useQuery({
		queryKey: ['league', 'coach-rankings', leagueSlug, stat],
		queryFn: getCompetitionCoachRankings.bind(null, leagueSlug, stat),
		enabled: !!leagueSlug,
		errorMessage: 'Failed to load coach rankings'
	});
};

const getCompetitionCoachRankings = async (competitionSlug: string, stat: string): Promise<CoachStatsRanking[]> => {
	const res = await apiClient.get(API_ROUTES.league.coachRankings(competitionSlug, stat));
	return res.data;
};
