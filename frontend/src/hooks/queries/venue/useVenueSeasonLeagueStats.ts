import { API_ROUTES } from '@/constants/routes';
import { VenueSeasonStats } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueSeasonLeagueStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'season-league-stats', venueSlug, season],
		queryFn: getVenueSeasonLeagueStats.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueSeasonLeagueStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await axios.get(API_ROUTES.venue.seasonLeagueStats(venueSlug, season));
	const raw = res.data;
	return raw;
};
