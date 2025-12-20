import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { PlayerStatsResponse } from '@/types/api/player-stats';
import { useQuery } from '@tanstack/react-query';

export const usePlayerStats = (key: keyof PlayerStatsResponse, sort: 'asc' | 'desc') => {
	return useQuery({
		queryKey: ['player-stats', key, sort],
		queryFn: getPlayerStats.bind(null, key, sort)
	});
};

const getPlayerStats = async (key: keyof PlayerStatsResponse, sort: 'asc' | 'desc'): Promise<PlayerStatsResponse[]> => {
	const params = new URLSearchParams({
		sort: key.toString(),
		direction: sort
	});

	const res = await apiClient.get(API_ROUTES.dashboard.playerStats(params.toString()));

	return res.data;
};
