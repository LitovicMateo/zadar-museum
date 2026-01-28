import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerTeamResponse } from '@/types/api/player';

export const usePlayerTeams = (playerId: string) => {
	return useQuery({
		queryKey: ['player-teams', playerId],
		queryFn: getPlayerTeams.bind(null, playerId),
		enabled: !!playerId,
		errorMessage: 'Failed to load player teams'
	});
};

const getPlayerTeams = async (playerId: string): Promise<PlayerTeamResponse[]> => {
	const res = await apiClient.get(API_ROUTES.player.teams(playerId));

	return res.data;
};
