import { API_ROUTES } from '@/constants/Routes';
import { useQuery } from '@/hooks/UseQueryWithToast';
import apiClient from '@/lib/ApiClient';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsResponse } from '@/types/api/Coach';

export const useSeasonTotalStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-total-stats', coachId, season, db],
		queryFn: getSeasonTotalStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load season total statistics'
	});
};

const getSeasonTotalStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse> => {
	const res = await apiClient.get(API_ROUTES.coach.seasonTotalStats(coachId, season, db));

	return res.data;
};
