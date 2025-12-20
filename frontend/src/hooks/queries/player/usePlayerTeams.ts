import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { PlayerTeamResponse } from '@/types/api/player';
import { useQuery } from '@tanstack/react-query';

export const usePlayerTeams = (playerId: string) => {
	return useQuery({
		queryKey: ['player-teams', playerId],
		queryFn: getPlayerTeams.bind(null, playerId),
		enabled: !!playerId
	});
};

const getPlayerTeams = async (playerId: string): Promise<PlayerTeamResponse[]> => {
	const res = await apiClient.get(API_ROUTES.player.teams(playerId));

	return unwrapCollection<PlayerTeamResponse>(res as unknown as { data?: unknown });
};
