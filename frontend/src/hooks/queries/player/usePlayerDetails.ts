import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerResponse } from '@/types/api/player';

export const usePlayerDetails = (playerId: string) => {
	return useQuery({
		queryKey: ['player', playerId],
		queryFn: fetchSinglePlayer.bind(null, playerId!),
		enabled: !!playerId,
		errorMessage: 'Failed to load player details'
	});
};

const fetchSinglePlayer = async (id: string): Promise<PlayerResponse> => {
	const res = await apiClient.get(API_ROUTES.player.profile.details(id));

	const raw = res.data.data;

	return raw;
};
