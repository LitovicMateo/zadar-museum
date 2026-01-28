import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsResponse } from '@/types/api/coach';

export const useSeasonLeagueStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-league-stats', coachId, season, db],
		queryFn: getSeasonLeagueStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load season league statistics'
	});
};

const getSeasonLeagueStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.seasonLeagueStats(coachId, season, db));

	return res.data;
};
