import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueSeasonStats } from '@/types/api/Venue';

export const useVenueSeasonStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'stats', venueSlug, season],
		queryFn: getVenueSeasonStats.bind(null, venueSlug, season),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue season statistics'
	});
};

const getVenueSeasonStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	if (!venueSlug || !season) {
		throw new Error('Venue slug and season are required to fetch season stats');
	}
	const res = await apiClient.get(API_ROUTES.venue.seasonStats(venueSlug, season));
	const raw = res.data;
	return raw;
};
