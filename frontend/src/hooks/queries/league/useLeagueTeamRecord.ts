import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { LeagueStats } from '@/types/api/team';

export const useLeagueTeamRecord = (leagueSlug: string) => {
	return useQuery({
		queryKey: ['league', 'team-record', leagueSlug],
		queryFn: getCompetitionTeamRecord.bind(null, leagueSlug),
		enabled: !!leagueSlug,
		errorMessage: 'Failed to load team record'
	});
};

const getCompetitionTeamRecord = async (competitionSlug: string): Promise<LeagueStats> => {
	const res = await apiClient.get(API_ROUTES.league.teamRecord(competitionSlug));

	const data = res.data;

	return data;
};
