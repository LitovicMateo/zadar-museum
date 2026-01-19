import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { VenueTeamRecordResponse } from '@/types/api/venue';

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
