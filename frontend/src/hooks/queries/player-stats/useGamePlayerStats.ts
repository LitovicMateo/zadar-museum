import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';

export const useGamePlayerStats = (game: string, team: string) => {
	return useQuery({
		queryKey: ['game-player-stats', game, team],
		queryFn: getGamePlayerStats.bind(null, game, team),
		enabled: !!game && !!team,
		errorMessage: 'Failed to load game player statistics'
	});
};

const getGamePlayerStats = async (game: string, team: string) => {
	const params = new URLSearchParams({
		game,
		team
	});
	const res = await apiClient.get(API_ROUTES.stats.player.game(params.toString()));

	const data = res.data;

	return data;
};
