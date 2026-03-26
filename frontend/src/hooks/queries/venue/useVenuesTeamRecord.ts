import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { VenueTeamRecordResponse } from '@/types/api/Venue';

export const useVenuesTeamRecord = () => {
	return useQuery({
		queryKey: ['venue', 'team-record'],
		queryFn: getVenuesTeamRecord,
		enabled: true,
		errorMessage: 'Failed to load team record'
	});
};

const getVenuesTeamRecord = async (): Promise<VenueTeamRecordResponse[]> => {
	const res = await apiClient.get(API_ROUTES.venue.venueRecords());

	console.log('RES', res);

	const raw = res.data;
	return raw;
};
