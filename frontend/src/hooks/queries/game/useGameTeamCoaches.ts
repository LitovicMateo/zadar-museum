import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { useQuery } from '@tanstack/react-query';

export const useGameTeamCoaches = (gameId: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['coaches', gameId, teamSlug],
		queryFn: getGameTeamCoaches.bind(null, gameId, teamSlug),
		enabled: !!gameId && !!teamSlug
	});
};

const getGameTeamCoaches = async (gameId: string, teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.game.coaches(gameId!, teamSlug));

	return unwrapSingle<TeamStatsResponse>(res as unknown as { data?: unknown }) as TeamStatsResponse;
};
