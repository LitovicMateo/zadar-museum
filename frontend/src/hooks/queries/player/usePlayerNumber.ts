import { API_ROUTES } from '@/constants/routes';
import { PlayerNumberResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerNumber = (playerId: string) => {
	return useQuery({
		queryKey: ['player-number', playerId],
		queryFn: getPlayerNumber.bind(null, playerId!)
	});
};

const getPlayerNumber = async (playerId: string): Promise<PlayerNumberResponse> => {
	const res = await axios.get(API_ROUTES.player.profile.number(playerId));

	return res.data;
};
