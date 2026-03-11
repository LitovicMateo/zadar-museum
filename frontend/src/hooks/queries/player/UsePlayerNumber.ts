import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerNumberResponse } from '@/types/api/Player';

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
