import { API_ROUTES } from '@/constants/routes';
import { CompetitionDetailsResponse } from '@/types/api/competition';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

	const res = await axios.get(API_ROUTES.dashboard.competitions(params.toString()));

	return res.data;
};
