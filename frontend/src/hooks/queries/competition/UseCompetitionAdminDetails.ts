import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

export const useCompetitionAdminDetails = (documentId: string) => {
	return useQuery<CompetitionDetailsResponse>({
		queryKey: ['competition-admin', documentId],
		queryFn: () =>
			apiClient
				.get(`${API_ROUTES.edit.competition(documentId)}?populate=*`)
				.then((res) => res.data.data),
		enabled: !!documentId,
		errorMessage: 'Failed to load competition'
	});
};
