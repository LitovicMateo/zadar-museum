import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { TeamScheduleResponse } from '@/types/api/Team';

export const useSeasonSchedule = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['games', 'schedule', season, teamSlug],
		queryFn: fetchSchedule.bind(null, season, teamSlug),
		enabled: !!season,
		errorMessage: 'Failed to load season schedule'
	});
};

const fetchSchedule = async (season: string, teamSlug: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.team.schedule(season, teamSlug));

	return res.data;
};
