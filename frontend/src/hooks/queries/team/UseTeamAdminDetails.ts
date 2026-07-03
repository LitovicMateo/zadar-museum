import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamDetailsResponse } from '@/types/api/Team';

export const useTeamAdminDetails = (documentId: string) => {
	return useQuery<TeamDetailsResponse>({
		queryKey: ['team-admin', documentId],
		queryFn: () =>
			apiClient.get(`${API_ROUTES.edit.team(documentId)}?populate=*`).then((res) => res.data.data),
		enabled: !!documentId,
		errorMessage: 'Failed to load team'
	});
};
