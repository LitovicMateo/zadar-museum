import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamDetailsResponse } from '@/types/api/Team';

export const useMainTeam = () => {
	return useQuery({
		queryKey: ['team', 'main'],
		queryFn: getMainTeam,
		errorMessage: 'Failed to load main team'
	});
};

const getMainTeam = async (): Promise<TeamDetailsResponse | undefined> => {
	const res = await apiClient.get(API_ROUTES.team.mainTeam());

	return res.data.data[0];
};
