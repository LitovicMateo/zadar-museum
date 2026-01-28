import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { VenueDetailsResponse } from '@/types/api/venue';

export const useVenueDetails = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', venueSlug],
		queryFn: getVenueDetails.bind(null, venueSlug),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue details'
	});
};

const getVenueDetails = async (venueSlug: string): Promise<VenueDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.venue.details(venueSlug));

	const raw = res.data;
	return raw;
};
