import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { VenueDetailsResponse } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';

export const useVenueDetails = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', venueSlug],
		queryFn: getVenueDetails.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueDetails = async (venueSlug: string): Promise<VenueDetailsResponse> => {
	const res = await apiClient.get(API_ROUTES.venue.details(venueSlug));

	const raw = res.data;
	return raw;
};
