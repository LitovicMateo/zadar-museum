import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
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

	const raw = res.data;
	return raw;
};
