import { API_ROUTES } from '@/constants/routes';
import { VenueDetailsResponse } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueDetails = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', venueSlug],
		queryFn: getVenueDetails.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueDetails = async (venueSlug: string): Promise<VenueDetailsResponse> => {
	const res = await axios.get(API_ROUTES.venue.details(venueSlug));

	const raw = res.data;
	return raw;
};
