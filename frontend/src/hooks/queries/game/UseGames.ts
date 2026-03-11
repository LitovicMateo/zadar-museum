import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { GameDetailsResponse } from '@/types/api/Game';

type GamesKey = keyof GameDetailsResponse;

export const useGames = (sortKey?: GamesKey, direction: 'asc' | 'desc' = 'asc') => {
	return useQuery({
		queryKey: ['games', sortKey, direction],
		queryFn: getAllGames.bind(null, sortKey, direction),
		errorMessage: 'Failed to load games'
	});
};

const getAllGames = async (sortKey?: GamesKey, direction: 'asc' | 'desc' = 'asc') => {
	const params = new URLSearchParams();
	if (sortKey) {
		params.append('sort', sortKey);
		params.append('direction', direction);
	}

	const res = await apiClient.get(API_ROUTES.dashboard.games(params.toString()));

	return res.data;
};
