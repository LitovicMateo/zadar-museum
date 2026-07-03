import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsResponse } from '@/types/api/TeamStats';

export const useTeamStatById = (documentId: string) => {
	return useQuery<TeamStatsResponse>({
		queryKey: ['team-stat', documentId],
		queryFn: async () => {
			const res = await apiClient.get(API_ROUTES.adminById.teamStats(documentId));
			return res.data.data;
		},
		enabled: !!documentId,
		errorMessage: 'Failed to load team stat'
	});
};
