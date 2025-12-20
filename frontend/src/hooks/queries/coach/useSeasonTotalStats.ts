import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient from '@/services/apiClient';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useSeasonTotalStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-total-stats', coachId, season, db],
		queryFn: getSeasonTotalStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db
	});
};

const getSeasonTotalStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.coach.seasonTotalStats(coachId, season, db));

	return res.data;
};
