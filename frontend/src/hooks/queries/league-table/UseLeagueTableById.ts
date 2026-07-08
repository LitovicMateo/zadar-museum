import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { LeagueTableRecord } from '@/types/api/LeagueTable';

/**
 * Loads a single league table for editing. Uses the dashboard admin endpoint
 * (strapi.db.query under the hood) rather than the plain core findOne — the
 * Public role's REST sanitization strips unpopulated/unpermitted relations like
 * `competition` from the default findOne response, same as it does for player-stats
 * and team-stats, so those entities' admin edit loads use the same admin-by-id route.
 */
export const useLeagueTableById = (documentId: string) => {
	return useQuery<LeagueTableRecord>({
		queryKey: ['league-table', documentId],
		queryFn: async () => {
			const res = await apiClient.get(API_ROUTES.adminById.leagueTable(documentId));
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load league table'
	});
};
