import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerStatsResponse } from '@/types/api/PlayerStats';

export const usePlayerStatById = (documentId: string) => {
	return useQuery<PlayerStatsResponse>({
		queryKey: ['player-stat', documentId],
		queryFn: async () => {
			const res = await apiClient.get(API_ROUTES.adminById.playerStats(documentId));
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load player stat'
	});
};
