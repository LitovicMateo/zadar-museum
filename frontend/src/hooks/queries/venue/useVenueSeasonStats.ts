import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { VenueSeasonStats } from '@/types/api/venue';

export const useVenueSeasonStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'stats', venueSlug, season],
		queryFn: getVenueSeasonStats.bind(null, venueSlug, season),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue season statistics'
	});
};

const getVenueSeasonStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await apiClient.get(API_ROUTES.venue.seasonStats(venueSlug, season));
	const raw = res.data;
	return raw;
};
