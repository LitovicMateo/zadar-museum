import { API_ROUTES } from '@/constants/routes';
import { VenueTeamRecordResponse } from '@/types/api/venue';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useVenueTeamRecord = (venueSlug: string) => {
	return useQuery({
		queryKey: ['venue', 'team-record', venueSlug],
		queryFn: getVenueTeamRecord.bind(null, venueSlug),
		enabled: !!venueSlug
	});
};

const getVenueTeamRecord = async (venueSlug: string): Promise<VenueTeamRecordResponse> => {
	const res = await axios.get(API_ROUTES.venue.teamRecord(venueSlug));

	const raw = res.data;
	return raw;
};
