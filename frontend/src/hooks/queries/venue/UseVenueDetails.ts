import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueDetailsResponse } from '@/types/api/Venue';

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
