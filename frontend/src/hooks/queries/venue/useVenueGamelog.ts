import { API_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueGamelog = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'gamelog', venueSlug, season],
		queryFn: getVenueGamelog.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueGamelog = async (venueSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await axios.get(API_ROUTES.venue.gamelog(venueSlug, season));

	const raw = res.data;
	return raw;
};
