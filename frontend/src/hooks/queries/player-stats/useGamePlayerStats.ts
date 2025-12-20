import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';

export const useGamePlayerStats = (game: string, team: string) => {
	return useQuery({
		queryKey: ['game-player-stats', game, team],
		queryFn: getGamePlayerStats.bind(null, game, team),
		enabled: !!game && !!team
	});
};

const getGamePlayerStats = async (game: string, team: string) => {
	const params = new URLSearchParams({
		game,
		team
	});
	const res = await apiClient.get(API_ROUTES.stats.player.game(params.toString()));

	return unwrapCollection(res as unknown as { data?: unknown });
};
