import { API_ROUTES } from '@/constants/routes';
import { CoachDetailsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type CoachKey = keyof CoachDetailsResponse;

export const useCoaches = (sortKey?: CoachKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['coaches', sortKey, direction],
		queryFn: getAllCoaches.bind(null, sortKey, direction)
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

	const res = await axios.get(API_ROUTES.dashboard.coaches(params.toString()));

	return res.data;
};
