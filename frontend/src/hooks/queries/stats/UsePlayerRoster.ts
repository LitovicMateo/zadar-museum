import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerRosterEntry } from '@/types/api/Player';

export const usePlayerRoster = () => {
	return useQuery({
		queryKey: ['player-roster'],
		queryFn: getPlayerRoster,
		errorMessage: 'Failed to load player roster'
	});
};

const getPlayerRoster = async (): Promise<PlayerRosterEntry[]> => {
	const res = await apiClient.get(API_ROUTES.stats.player.roster());

	return res.data;
};
