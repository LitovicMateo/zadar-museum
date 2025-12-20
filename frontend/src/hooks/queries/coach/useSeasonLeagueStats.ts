import { API_ROUTES } from '@/constants/routes';
import { PlayerDB } from '@/pages/Player/Player';
import apiClient, { unwrapCollection } from '@/services/apiClient';
import { CoachStatsResponse } from '@/types/api/coach';
import { useQuery } from '@tanstack/react-query';

export const useSeasonLeagueStats = (coachId: string, season: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['season-league-stats', coachId, season, db],
		queryFn: getSeasonLeagueStats.bind(null, coachId, season, db),
		enabled: !!coachId && !!db
	});
};

const getSeasonLeagueStats = async (coachId: string, season: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get<import('@/types/api/coach').CoachStatsResponse[]>(
		API_ROUTES.coach.seasonLeagueStats(coachId, season, db)
	);

	return unwrapCollection<import('@/types/api/coach').CoachStatsResponse>(res as unknown as { data?: unknown });
};
