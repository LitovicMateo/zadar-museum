import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
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
	const res = await apiClient.get<import('@/types/api/venue').VenueDetailsResponse>(
		API_ROUTES.venue.details(venueSlug)
	);

	const raw = unwrapSingle<import('@/types/api/venue').VenueDetailsResponse>(res as unknown as { data?: unknown });
	return raw as import('@/types/api/venue').VenueDetailsResponse;
};
