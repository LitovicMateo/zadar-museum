import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { AggregatePlayerStatResponse } from '@/types/api/PlayerStats';

/**
 * Loads a single aggregate line for editing. Populates the competition relation
 * directly (aggregate lines have no game, so competition/season live on the row).
 */
export const useAggregatePlayerStatById = (documentId: string) => {
	return useQuery<AggregatePlayerStatResponse>({
		queryKey: ['aggregate-player-stat', documentId],
		queryFn: async () => {
			const res = await apiClient.get(API_ROUTES.adminById.playerStats(documentId));
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load aggregate line'
	});
};
