import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useVenueSeasons = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'seasons', venueSlug],
		queryFn: getVenueSeasons.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueSeasons = async (venueSlug: string): Promise<string[]> => {
	const res = await apiClient.get<string[]>(API_ROUTES.venue.seasons(venueSlug));
	return unwrapCollection<string>(res as unknown as { data?: unknown });
};
