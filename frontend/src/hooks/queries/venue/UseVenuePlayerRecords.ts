import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenuePlayerRecord } from '@/types/api/Venue';

export const useVenuePlayerRecords = (venueSlug: string, statKey: string, season?: string) => {
	return useQuery({
		queryKey: ['venue', 'player-records', venueSlug, statKey, season],
		queryFn: getVenuePlayerRecords.bind(null, venueSlug, statKey, season),
		enabled: !!venueSlug && !!statKey,
		errorMessage: 'Failed to load venue player records'
	});
};

const getVenuePlayerRecords = async (
	venueSlug: string,
	statKey: string,
	season?: string
): Promise<VenuePlayerRecord[]> => {
	const res = await apiClient.get(API_ROUTES.venue.playerRecords(venueSlug, statKey, season));
	return res.data;
};
