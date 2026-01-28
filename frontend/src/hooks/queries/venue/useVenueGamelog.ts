import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamScheduleResponse } from '@/types/api/team';

export const useVenueGamelog = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'gamelog', venueSlug, season],
		queryFn: getVenueGamelog.bind(null, venueSlug, season),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue gamelog'
	});
};

const getVenueGamelog = async (venueSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.venue.gamelog(venueSlug, season));

	const raw = res.data;
	return raw;
};
