import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamPlayerRecord } from '@/types/api/Team';

export const useTeamPlayerRecords = (teamSlug: string, statKey: string, season?: string) => {
	return useQuery({
		queryKey: ['team', 'player-records', teamSlug, statKey, season],
		queryFn: getTeamPlayerRecords.bind(null, teamSlug, statKey, season),
		enabled: !!teamSlug && !!statKey,
		errorMessage: 'Failed to load team player records'
	});
};

const getTeamPlayerRecords = async (
	teamSlug: string,
	statKey: string,
	season?: string
): Promise<TeamPlayerRecord[]> => {
	const res = await apiClient.get(API_ROUTES.team.playerRecords(teamSlug, statKey, season));
	return res.data;
};
