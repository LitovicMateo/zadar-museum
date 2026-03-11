import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamDetailsResponse } from '@/types/api/Team';

type TeamKey = keyof TeamDetailsResponse;

export const useTeams = (sortKey?: TeamKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['teams', sortKey, direction],
		queryFn: getAllTeams.bind(null, sortKey, direction),
		errorMessage: 'Failed to load teams'
	});
};

const getAllTeams = async (sortKey?: TeamKey, direction: 'asc' | 'desc' = 'asc'): Promise<TeamDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.teams(params.toString()));

	return res.data;
};
