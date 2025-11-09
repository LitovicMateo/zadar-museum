import { API_ROUTES } from '@/constants/routes';
import { VenueSeasonStats } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueSeasonStats = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'stats', venueSlug, season],
		queryFn: getVenueSeasonStats.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueSeasonStats = async (venueSlug: string, season: string): Promise<VenueSeasonStats[]> => {
	const res = await axios.get(API_ROUTES.venue.seasonStats(venueSlug, season));
	const raw = res.data;
	return raw;
};
