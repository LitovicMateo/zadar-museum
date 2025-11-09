import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
	const res = await axios.get(API_ROUTES.stats.player.game(params.toString()));

	const data = res.data;

	return data;
};
