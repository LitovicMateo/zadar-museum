import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useVenueSeasonCompetitions = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'competitions', venueSlug, season],
		queryFn: getVenueCompetitions.bind(null, venueSlug, season),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load venue competitions'
	});
};

const getVenueCompetitions = async (
	venueSlug: string,
	season: string
): Promise<{ league_id: string; league_name: string; league_slug: string }[]> => {
	const res = await apiClient.get(API_ROUTES.venue.competitions(venueSlug, season));
	const raw = res.data;
	return raw;
};
