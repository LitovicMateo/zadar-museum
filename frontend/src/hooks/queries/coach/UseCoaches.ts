import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachDetailsResponse } from '@/types/api/Coach';

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
