import { API_ROUTES } from '@/constants/routes';
import { TeamBoxscoreResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameTeamStats = (gameId: string) =>
	useQuery({
		queryKey: ['team-stats', gameId],
		queryFn: fetchSingleGameTeamBoxscore.bind(null, gameId!),
		enabled: !!gameId
	});

const fetchSingleGameTeamBoxscore = async (gameId: string): Promise<TeamBoxscoreResponse[]> => {
	const res = await axios.get(API_ROUTES.game.teamStats(gameId));

	return res.data as TeamBoxscoreResponse[];
};
