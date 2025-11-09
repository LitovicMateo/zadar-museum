import { API_ROUTES } from '@/constants/routes';
import { PlayerCompetitionResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const usePlayerCompetitions = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['player-competitions', playerId, season],
		queryFn: getPlayerCompetition.bind(null, playerId, season),
		enabled: !!playerId && !!season
	});
};

const getPlayerCompetition = async (playerId: string, season: string): Promise<PlayerCompetitionResponse[]> => {
	const res = await axios.get(API_ROUTES.player.competitions(playerId, season));

	const data = res.data;

	return data ?? [];
};
