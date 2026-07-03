import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueDetailsResponse } from '@/types/api/Venue';

export const useVenueAdminDetails = (documentId: string) => {
	return useQuery<VenueDetailsResponse>({
		queryKey: ['venue-admin', documentId],
		queryFn: () =>
			apiClient.get(`${API_ROUTES.edit.venue(documentId)}?populate=*`).then((res) => res.data.data),
		enabled: !!documentId,
		errorMessage: 'Failed to load venue'
	});
};
