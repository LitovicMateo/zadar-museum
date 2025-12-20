import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useVenueGamelog = (venueSlug: string, season: string) => {
	return useQuery({
		queryKey: ['venue', 'gamelog', venueSlug, season],
		queryFn: getVenueGamelog.bind(null, venueSlug, season),
		enabled: !!venueSlug
	});
};

const getVenueGamelog = async (venueSlug: string, season: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get<import('@/types/api/team').TeamScheduleResponse[]>(
		API_ROUTES.venue.gamelog(venueSlug, season)
	);

	return unwrapCollection<import('@/types/api/team').TeamScheduleResponse>(res as unknown as { data?: unknown });
};
