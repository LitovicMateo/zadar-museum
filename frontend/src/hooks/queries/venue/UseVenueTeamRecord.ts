import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueTeamRecordResponse } from '@/types/api/Venue';

export const useVenueTeamRecord = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'team-record', venueSlug],
		queryFn: getVenueTeamRecord.bind(null, venueSlug),
		enabled: !!venueSlug,
		errorMessage: 'Failed to load team record'
	});
};

const getVenueTeamRecord = async (venueSlug: string): Promise<VenueTeamRecordResponse> => {
	const res = await apiClient.get(API_ROUTES.venue.teamRecord(venueSlug));

	const raw = res.data;
	return raw;
};
