import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { LeagueTableByLeague } from '@/types/api/LeagueTable';

/**
 * Loads the final standings table(s) for a competition + season (one entry per
 * stage), with each standing row's team info resolved server-side.
 */
export const useLeagueTablesByLeague = (leagueSlug: string, season: string) => {
	return useQuery<LeagueTableByLeague[]>({
		queryKey: ['league-table', 'by-league', leagueSlug, season],
		queryFn: async () => {
			const res = await apiClient.get(API_ROUTES.leagueTable.byLeague(leagueSlug, season));
			return res.data;
		},
		enabled: !!leagueSlug && !!season,
		errorMessage: 'Failed to load league table'
	});
};
