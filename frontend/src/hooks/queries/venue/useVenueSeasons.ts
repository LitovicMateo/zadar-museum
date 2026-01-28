import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useVenueSeasons = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'seasons', venueSlug],
		queryFn: getVenueSeasons.bind(null, venueSlug),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue seasons'
	});
};

const getVenueSeasons = async (venueSlug: string): Promise<string[]> => {
	const res = await apiClient.get(API_ROUTES.venue.seasons(venueSlug));
	const raw = res.data;
	return raw;
};
