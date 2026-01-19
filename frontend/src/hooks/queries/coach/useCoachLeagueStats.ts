import { API_ROUTES } from '@/constants/routes';
import { useQuery } from '@/hooks/use-query-with-toast';
import apiClient from '@/lib/api-client';
import { PlayerDB } from '@/pages/Player/Player';
import { CoachStatsResponse } from '@/types/api/coach';

export const useCoachLeagueStats = (coachId: string, db: PlayerDB) => {
	return useQuery({
		queryKey: ['coach', 'league-stats', coachId, db],
		queryFn: getCoachLeagueStats.bind(null, coachId, db),
		enabled: !!coachId && !!db,
		errorMessage: 'Failed to load coach league statistics'
	});
};

const getCoachLeagueStats = async (coachId: string, db: PlayerDB): Promise<CoachStatsResponse[]> => {
	const res = await apiClient.get(API_ROUTES.coach.leagueStats(coachId, db));

	return res.data;
};
