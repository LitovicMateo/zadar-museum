import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';

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
