import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerAllTimeStats } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerLeagueStats = (leagueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['player', 'league', 'stats', leagueSlug, season],
		queryFn: getSinglePlayerLeagueStats.bind(null, leagueSlug, season),
		enabled: !!leagueSlug && !!season
	});
};

const getSinglePlayerLeagueStats = async (leagueSlug: string, season: string): Promise<PlayerAllTimeStats[]> => {
	const res = await apiClient.get<PlayerAllTimeStats[]>(API_ROUTES.league.playerSeasonStats(leagueSlug, season));

	return unwrapCollection<PlayerAllTimeStats>(res as unknown as { data?: unknown });
};
