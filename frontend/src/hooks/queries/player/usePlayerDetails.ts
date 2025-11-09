import { API_ROUTES } from '@/constants/routes';
import { PlayerResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerDetails = (playerId: string) => {
	return useQuery({
		queryKey: ['player', playerId],
		queryFn: fetchSinglePlayer.bind(null, playerId!),
		enabled: !!playerId
	});
};

const fetchSinglePlayer = async (id: string): Promise<PlayerResponse> => {
	const res = await axios.get(API_ROUTES.player.profile.details(id));

	const raw = res.data.data;

	return raw;
};
