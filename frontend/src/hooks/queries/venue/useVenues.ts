import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { VenueDetailsResponse } from '@/types/api/venue';

type VenueKey = keyof VenueDetailsResponse;

export const useVenues = (sortKey?: VenueKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['venues', sortKey, direction],
		queryFn: getAllVenues.bind(null, sortKey, direction),
		errorMessage: 'Failed to load venues'
	});
};

const getAllVenues = async (sortKey?: VenueKey, direction: 'asc' | 'desc' = 'asc'): Promise<VenueDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.venues(params.toString()));

	return res.data;
};
