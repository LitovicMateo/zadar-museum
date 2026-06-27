import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { CoachRosterEntry } from '@/types/api/Coach';

export const useCoachRoster = () => {
	return useQuery({
		queryKey: ['coach-roster'],
		queryFn: getCoachRoster,
		errorMessage: 'Failed to load coach roster'
	});
};

const getCoachRoster = async (): Promise<CoachRosterEntry[]> => {
	const res = await apiClient.get(API_ROUTES.stats.coach.roster());

	return res.data;
};
