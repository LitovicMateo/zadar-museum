import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { VenueSeasonStats } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';

export const useVenueSeasonLeagueStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'season-league-stats', venueSlug, season],
		queryFn: getVenueSeasonLeagueStats.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueSeasonLeagueStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await apiClient.get<import('@/types/api/venue').VenueSeasonStats[]>(API_ROUTES.venue.seasonLeagueStats(venueSlug, season));
	const raw = res.data ?? [];
	return raw;
};
