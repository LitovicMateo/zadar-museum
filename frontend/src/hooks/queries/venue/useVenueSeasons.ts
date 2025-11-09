import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueSeasons = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'seasons', venueSlug],
		queryFn: getVenueSeasons.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueSeasons = async (venueSlug: string): Promise<string[]> => {
	const res = await axios.get(API_ROUTES.venue.seasons(venueSlug));
	const raw = res.data;
	return raw;
};
