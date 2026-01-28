import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { TeamScheduleResponse } from '@/types/api/team';

export const useSeasonSchedule = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['games', 'schedule', season],
		queryFn: fetchSchedule.bind(null, season, teamSlug),
		enabled: !!season,
		errorMessage: 'Failed to load season schedule'
	});
};

const fetchSchedule = async (season: string, teamSlug: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.team.schedule(season, teamSlug));

	return res.data;
};
