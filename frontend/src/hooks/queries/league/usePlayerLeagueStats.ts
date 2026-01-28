import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerAllTimeStats } from '@/types/api/player';

export const usePlayerLeagueStats = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['player', 'league', 'stats', leagueSlug, season],
		queryFn: getSinglePlayerLeagueStats.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load player league statistics'
	});
};

const getSinglePlayerLeagueStats = async (leagueSlug: string, season: string): Promise<PlayerAllTimeStats[]> => {
	const res = await apiClient.get(API_ROUTES.league.playerSeasonStats(leagueSlug, season));

	const data = res.data;

	return data;
};
