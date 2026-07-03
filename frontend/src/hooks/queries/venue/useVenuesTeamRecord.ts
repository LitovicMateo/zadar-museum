import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueLocation, VenueTeamRecordResponse } from '@/types/api/Venue';

export const useVenuesTeamRecord = (location: VenueLocation) => {
	return useQuery({
		queryKey: ['venue', 'team-record', location],
		queryFn: () => getVenuesTeamRecord(location),
		enabled: true,
		errorMessage: 'Failed to load team record'
	});
};

const getVenuesTeamRecord = async (location: VenueLocation): Promise<VenueTeamRecordResponse[]> => {
	const res = await apiClient.get(API_ROUTES.venue.venueRecords(location));

	const raw = res.data;
	return raw;
};
