import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerAllTimeStats } from '@/types/api/Player';

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
