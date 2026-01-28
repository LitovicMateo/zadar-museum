import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerNumberResponse } from '@/types/api/player';

export const usePlayerNumber = (playerId: string) => {
	return useQuery({
		queryKey: ['player-number', playerId],
		queryFn: getPlayerNumber.bind(null, playerId!),
		errorMessage: 'Failed to load player number'
	});
};

const getPlayerNumber = async (playerId: string): Promise<PlayerNumberResponse> => {
	const res = await apiClient.get(API_ROUTES.player.profile.number(playerId));

	return res.data;
};
