import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapCollection } from '@/services/apiClient';
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
	const res = await apiClient.get<import('@/types/api/team').TeamScheduleResponse[]>(
		API_ROUTES.team.schedule(season, teamSlug)
	);

	return unwrapCollection<import('@/types/api/team').TeamScheduleResponse>(res as unknown as { data?: unknown });
};
