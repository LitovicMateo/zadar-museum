import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';

export const useTeamsWithStats = (gameId: string) => {
	return useQuery({
		queryKey: ['dashboard', 'game', gameId, 'with-stats'],
		queryFn: getTeamsWithStats.bind(null, gameId),
		enabled: !!gameId,
		errorMessage: 'Failed to load teams with stats'
	});
};

const getTeamsWithStats = async (
	gameId: string
): Promise<{
	gameId: string;
	teams: {
		id: string;
		name: string;
	}[];
}> => {
	const res = await apiClient.get(API_ROUTES.dashboard.teamsWithStats(gameId));

	return res.data;
};
