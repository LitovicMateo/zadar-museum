import { API_ROUTES } from '@/constants/routes';
import { RefereeDetailsResponse } from '@/types/api/referee';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type RefereeKey = keyof RefereeDetailsResponse;

export const useReferees = (sortKey?: RefereeKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['referees', sortKey, direction],
		queryFn: getAllReferee.bind(null, sortKey, direction)
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

	const res = await axios.get(API_ROUTES.dashboard.referees(params.toString()));

	return res.data;
};
