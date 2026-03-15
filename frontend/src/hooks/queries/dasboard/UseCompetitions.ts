import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

type CompetitionKey = keyof CompetitionDetailsResponse;

export const useCompetitions = (sortKey?: CompetitionKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['competitions', sortKey, direction],
		queryFn: getAllCompetitions.bind(null, sortKey, direction),
		errorMessage: 'Failed to load competitions'
	});
};

const getAllCompetitions = async (
	sortKey?: CompetitionKey,
	direction: 'asc' | 'desc' = 'asc'
): Promise<CompetitionDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.competitions(params.toString()));

	return res.data;
};
