import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';
import { keepPreviousData } from '@tanstack/react-query';

export const useVenueGamelog = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'gamelog', venueSlug, season],
		queryFn: getVenueGamelog.bind(null, venueSlug, season),
		enabled: !!venueSlug && !!season,
		placeholderData: keepPreviousData,
		errorMessage: 'Failed to load venue gamelog'
	});
};

const getVenueGamelog = async (venueSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.venue.gamelog(venueSlug, season));

	const raw = res.data;
	return raw;
};
