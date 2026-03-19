import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueTeamRecord } from '@/types/api/Venue';

export const useVenueTeamRecords = (venueSlug: string, statKey: string, season?: string) => {
	return useQuery({
		queryKey: ['venue', 'team-records', venueSlug, statKey, season],
		queryFn: getVenueTeamRecords.bind(null, venueSlug, statKey, season),
		enabled: !!venueSlug && !!statKey,
		errorMessage: 'Failed to load venue team records'
	});
};

const getVenueTeamRecords = async (venueSlug: string, statKey: string, season?: string): Promise<VenueTeamRecord[]> => {
	const res = await apiClient.get(API_ROUTES.venue.teamRecords(venueSlug, statKey, season));
	return res.data;
};
