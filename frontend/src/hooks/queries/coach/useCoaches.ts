import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { CoachDetailsResponse } from '@/types/api/coach';

type CoachKey = keyof CoachDetailsResponse;

export const useCoaches = (sortKey?: CoachKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['coaches', sortKey, direction],
		queryFn: getAllCoaches.bind(null, sortKey, direction),
		errorMessage: 'Failed to load coaches'
	});
};

const getAllCoaches = async (
	sortKey?: CoachKey,
	direction: 'asc' | 'desc' = 'asc'
): Promise<CoachDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.coaches(params.toString()));

	return res.data;
};
