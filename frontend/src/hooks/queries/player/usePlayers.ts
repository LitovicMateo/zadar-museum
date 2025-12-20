import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

type PlayerKey = keyof PlayerResponse;

export const usePlayers = (sortKey?: PlayerKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['players', sortKey, direction],
		queryFn: getAllPlayers.bind(null, sortKey, direction)
	});
};

const getAllPlayers = async (sortKey?: PlayerKey, direction: 'asc' | 'desc' = 'asc'): Promise<PlayerResponse[]> => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get<PlayerResponse[]>(API_ROUTES.dashboard.players(params.toString()));
	return unwrapCollection<PlayerResponse>(res as unknown as { data?: unknown });
};
