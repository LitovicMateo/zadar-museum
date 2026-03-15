import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueSeasonStats } from '@/types/api/Venue';

export const useVenueSeasonLeagueStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'season-league-stats', venueSlug, season],
		queryFn: getVenueSeasonLeagueStats.bind(null, venueSlug, season),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load season league statistics'
	});
};

const getVenueSeasonLeagueStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await apiClient.get(API_ROUTES.venue.seasonLeagueStats(venueSlug, season));
	const raw = res.data;
	return raw;
};
