import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { PlayerNumberResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerNumber = (playerId: string) => {
	return useQuery({
		queryKey: ['player-number', playerId],
		queryFn: getPlayerNumber.bind(null, playerId!)
	});
};

const getPlayerNumber = async (playerId: string): Promise<PlayerNumberResponse> => {
	const res = await apiClient.get(API_ROUTES.player.profile.number(playerId));

	return res.data;
};
