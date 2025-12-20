import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/services/apiClient';
import { TeamScheduleResponse } from '@/types/api/team';
import { useQuery } from '@tanstack/react-query';

export const useSeasonSchedule = (season: string, teamSlug: string) => {
	return useQuery({
		queryKey: ['games', 'schedule', season],
		queryFn: fetchSchedule.bind(null, season, teamSlug),
		enabled: !!season
	});
};

const fetchSchedule = async (season: string, teamSlug: string): Promise<TeamScheduleResponse[]> => {
	const res = await apiClient.get(API_ROUTES.team.schedule(season, teamSlug));

	return res.data;
};
