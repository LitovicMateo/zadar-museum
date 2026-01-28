import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerResponse } from '@/types/api/player';

type PlayerKey = keyof PlayerResponse;

export const usePlayers = (sortKey?: PlayerKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['players', sortKey, direction],
		queryFn: getAllPlayers.bind(null, sortKey, direction),
		errorMessage: 'Failed to load players'
	});
};

const getAllPlayers = async (sortKey?: PlayerKey, direction: 'asc' | 'desc' = 'asc'): Promise<PlayerResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.players(params.toString()));

	return res.data;
};
