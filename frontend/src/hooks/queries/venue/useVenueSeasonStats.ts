import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { VenueSeasonStats } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';

export const useVenueSeasonStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'stats', venueSlug, season],
		queryFn: getVenueSeasonStats.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueSeasonStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await apiClient.get<import('@/types/api/venue').VenueSeasonStats[]>(
		API_ROUTES.venue.seasonStats(venueSlug, season)
	);

	return unwrapCollection<import('@/types/api/venue').VenueSeasonStats>(res as unknown as { data?: unknown });
};
