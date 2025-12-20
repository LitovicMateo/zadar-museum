import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { CompetitionDetailsResponse } from '@/types/api/competition';
import { useQuery } from '@tanstack/react-query';

type CompetitionKey = keyof CompetitionDetailsResponse;

export const useCompetitions = (sortKey?: CompetitionKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['competitions', sortKey, direction],
		queryFn: getAllCompetitions.bind(null, sortKey, direction)
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

	return unwrapCollection<CompetitionDetailsResponse>(res as unknown as { data?: unknown });
};
