import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useSeasonTotalStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-total-stats', coachId, season, db],
		queryFn: getSeasonTotalStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!season && !!db
	});
};

const getSeasonTotalStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse> => {
	const res = await apiClient.get<import('@/types/api/coach').CoachStatsResponse>(
		API_ROUTES.coach.seasonTotalStats(coachId, season, db)
	);

	return unwrapSingle<import('@/types/api/coach').CoachStatsResponse>(
		res as unknown as { data?: unknown }
	) as import('@/types/api/coach').CoachStatsResponse;
};
