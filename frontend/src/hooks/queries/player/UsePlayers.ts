import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerResponse } from '@/types/api/Player';

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
