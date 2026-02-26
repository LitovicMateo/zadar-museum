import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerAllTimeStats } from '@/types/api/player';

export const useLeaguePlayerRankings = (leagueSlug: string, stat: string) => {
	return useQuery({
		queryKey: ['league', 'player-rankings', leagueSlug, stat],
		queryFn: getCompetitionPlayerRankings.bind(null, leagueSlug, stat),
		enabled: !!leagueSlug,
		errorMessage: 'Failed to load player rankings'
	});
};

const getCompetitionPlayerRankings = async (competitionSlug: string, stat: string): Promise<PlayerAllTimeStats[]> => {
	const res = await apiClient.get(API_ROUTES.league.playerRankings(competitionSlug, stat));
	return res.data;
};
