import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamTeamRecord } from '@/types/api/Team';

export const useTeamTeamRecords = (teamSlug: string, statKey: string, season?: string) => {
	return useQuery({
		queryKey: ['team', 'team-records', teamSlug, statKey, season],
		queryFn: getTeamTeamRecords.bind(null, teamSlug, statKey, season),
		enabled: !!teamSlug && !!statKey,
		errorMessage: 'Failed to load team records'
	});
};

const getTeamTeamRecords = async (teamSlug: string, statKey: string, season?: string): Promise<TeamTeamRecord[]> => {
	const res = await apiClient.get(API_ROUTES.team.teamRecords(teamSlug, statKey, season));
	return res.data;
};
