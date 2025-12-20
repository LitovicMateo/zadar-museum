import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
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
	return res.data;
};
