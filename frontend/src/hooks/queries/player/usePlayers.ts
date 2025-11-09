import { API_ROUTES } from '@/constants/routes';
import { PlayerResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

	const res = await axios.get(API_ROUTES.dashboard.players(params.toString()));

	return res.data;
};
