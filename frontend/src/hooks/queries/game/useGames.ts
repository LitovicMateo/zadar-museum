import { API_ROUTES } from '@/constants/routes';
import { GameDetailsResponse } from '@/types/api/game';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type GamesKey = keyof GameDetailsResponse;

export const useGames = (sortKey?: GamesKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['games', sortKey, direction],
		queryFn: getAllGames.bind(null, sortKey, direction)
	});
};

const getAllGames = async (sortKey?: GamesKey, direction: 'asc' | 'desc' = 'asc') => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await axios.get(API_ROUTES.dashboard.games(params.toString()));

	return res.data;
};
