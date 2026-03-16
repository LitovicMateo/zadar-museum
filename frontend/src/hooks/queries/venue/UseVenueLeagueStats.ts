import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueLeagueStats } from '@/types/api/Venue';

export const useVenueLeagueStats = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'league-stats', venueSlug],
		queryFn: getVenueLeagueStats.bind(null, venueSlug),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue league statistics'
	});
};

const getVenueLeagueStats = async (venueSlug: string): Promise<VenueLeagueStats[]> => {
	const res = await apiClient.get(API_ROUTES.venue.leagueStats(venueSlug));
	return res.data;
};
