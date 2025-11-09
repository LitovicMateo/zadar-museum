import { API_ROUTES } from '@/constants/routes';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGameTeamCoaches = (gameId: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['coaches', gameId, teamSlug],
		queryFn: getGameTeamCoaches.bind(null, gameId, teamSlug),
		enabled: !!gameId && !!teamSlug
	});
};

const getGameTeamCoaches = async (gameId: string, teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await axios.get(API_ROUTES.game.coaches(gameId!, teamSlug));
	const raw = res.data;
	return raw as TeamStatsResponse;
};
