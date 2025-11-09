import { API_ROUTES } from '@/constants/routes';
import { VenueDetailsResponse } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type VenueKey = keyof VenueDetailsResponse;

export const useVenues = (sortKey?: VenueKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['venues', sortKey, direction],
		queryFn: getAllVenues.bind(null, sortKey, direction)
	});
};

const getAllVenues = async (sortKey?: VenueKey, direction: 'asc' | 'desc' = 'asc'): Promise<VenueDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await axios.get(API_ROUTES.dashboard.venues(params.toString()));

	return res.data;
};
