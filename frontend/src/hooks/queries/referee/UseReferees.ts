import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { RefereeDetailsResponse } from '@/types/api/Referee';

type RefereeKey = keyof RefereeDetailsResponse;

export const useReferees = (sortKey?: RefereeKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['referees', sortKey, direction],
		queryFn: getAllReferee.bind(null, sortKey, direction),
		errorMessage: 'Failed to load referees'
	});
};

const getAllReferee = async (
	sortKey?: RefereeKey,
	direction: 'asc' | 'desc' = 'asc'
): Promise<RefereeDetailsResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.referees(params.toString()));

	return res.data;
};
