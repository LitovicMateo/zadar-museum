import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const useLeaguePlayerRankings = (leagueSlug: string, stat: string) => {
	return useQuery({
		queryKey: ['league', 'player-rankings', leagueSlug, stat],
		queryFn: getCompetitionPlayerRankings.bind(null, leagueSlug, stat),
		enabled: !!leagueSlug
	});
};

const getCompetitionPlayerRankings = async (competitionSlug: string, stat: string): Promise<PlayerAllTimeStats[]> => {
	const res = await apiClient.get(API_ROUTES.league.playerRankings(competitionSlug, stat));

	return unwrapCollection<PlayerAllTimeStats>(res as unknown as { data?: unknown });
};
