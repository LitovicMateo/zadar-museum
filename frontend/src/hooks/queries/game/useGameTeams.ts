import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useGameTeams = (gameId: string) => {
	return useQuery({
		queryKey: ['dashboard', 'game', gameId],
		queryFn: getGameTeams.bind(null, gameId),
		enabled: !!gameId
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

	return unwrapSingle<{
		gameId: string;
		teams: {
			id: string;
			name: string;
		}[];
	}>(res as unknown as { data?: unknown }) as {
		gameId: string;
		teams: {
			id: string;
			name: string;
		}[];
	};
};
