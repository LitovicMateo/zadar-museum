import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useGameTeams = (gameId: string) => {
	return useQuery({
		queryKey: ['dashboard', 'game', gameId],
		queryFn: getGameTeams.bind(null, gameId),
		enabled: !!gameId,
		errorMessage: 'Failed to load game teams'
	});
};

const getGameTeams = async (
	gameId: string
): Promise<{
	gameId: string;
	teams: {
		id: string;
		name: string;
	}[];
}> => {
	const res = await apiClient.get(API_ROUTES.dashboard.teamsInGame(gameId));

	return res.data;
};
