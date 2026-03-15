import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerCompetitionResponse } from '@/types/api/Player';

export const usePlayerCompetitions = (playerId: string, season: string) => {
	return useQuery({
		queryKey: ['player-competitions', playerId, season],
		queryFn: getPlayerCompetition.bind(null, playerId, season),
		enabled: !!playerId && !!season,
		errorMessage: 'Failed to load player competitions'
	});
};

const getPlayerCompetition = async (playerId: string, season: string): Promise<PlayerCompetitionResponse[]> => {
	const res = await apiClient.get(API_ROUTES.player.competitions(playerId, season));

	const data = res.data;

	return data ?? [];
};
