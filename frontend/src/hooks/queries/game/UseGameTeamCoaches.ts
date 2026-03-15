import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamStatsResponse } from '@/types/api/TeamStats';

export const useGameTeamCoaches = (gameId: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['coaches', gameId, teamSlug],
		queryFn: getGameTeamCoaches.bind(null, gameId, teamSlug),
		enabled: !!gameId && !!teamSlug,
		errorMessage: 'Failed to load game coaches'
	});
};

const getGameTeamCoaches = async (gameId: string, teamSlug: string): Promise<TeamStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.game.coaches(gameId!, teamSlug));
	const raw = res.data;
	return raw as TeamStatsResponse;
};
