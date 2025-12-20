import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerCompetitionResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerCompetitions = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['player-competitions', playerId, season],
		queryFn: getPlayerCompetition.bind(null, playerId, season),
		enabled: !!playerId && !!season
	});
};

const getPlayerCompetition = async (playerId: string, season: string): Promise<PlayerCompetitionResponse[]> => {
	const res = await apiClient.get(API_ROUTES.player.competitions(playerId, season));

	return unwrapCollection<PlayerCompetitionResponse>(res as unknown as { data?: unknown });
};
