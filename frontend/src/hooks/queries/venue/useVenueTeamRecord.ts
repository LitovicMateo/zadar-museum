import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { VenueTeamRecordResponse } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';

export const useVenueTeamRecord = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'team-record', venueSlug],
		queryFn: getVenueTeamRecord.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueTeamRecord = async (venueSlug: string): Promise<VenueTeamRecordResponse> => {
	const res = await apiClient.get<import('@/types/api/venue').VenueTeamRecordResponse>(
		API_ROUTES.venue.teamRecord(venueSlug)
	);

	return unwrapSingle<import('@/types/api/venue').VenueTeamRecordResponse>(
		res as unknown as { data?: unknown }
	) as import('@/types/api/venue').VenueTeamRecordResponse;
};
